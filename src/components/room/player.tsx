import { useCallback, useEffect, useRef, useState } from 'react';
import YouTubePlayer from 'react-player/youtube';
import { useWebSocketContext } from '@/websocket-context';

export interface CaptionTrack { languageCode: string; languageName?: string; name?: string }
type YTPlayer = YouTubePlayer & { getPlayerState: () => number; getPlaybackRate: () => number; setPlaybackRate: (rate: number) => void; playVideo: () => void; pauseVideo: () => void };
type SyncState = { position: number; status: boolean; rate: number };
const SMALL_DRIFT = 1.5;
const LARGE_DRIFT = 5;

export default function Player({ room_id }: { room_id: string }) {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoSpeed, setVideoSpeed] = useState(1);
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=LXb3EKWsInQ');
  const correctionRef = useRef(false);
  const pendingSyncRef = useRef<SyncState | null>(null);
  const lastSentPlayingRef = useRef<boolean | null>(null);
  const { sendMessage, lastMessage } = useWebSocketContext();

  const applySyncState = useCallback((state: SyncState) => {
    const target = player as YTPlayer | null;
    if (!target) { pendingSyncRef.current = state; return; }
    pendingSyncRef.current = null;
    correctionRef.current = true;
    const drift = state.position - target.getCurrentTime();
    if (Math.abs(drift) > LARGE_DRIFT) {
      target.seekTo(state.position, 'seconds');
      target.setPlaybackRate(state.rate);
    } else if (Math.abs(drift) > SMALL_DRIFT && state.status) {
      target.setPlaybackRate(Math.min(2, Math.max(0.25, state.rate + Math.sign(drift) * 0.15)));
    } else {
      target.setPlaybackRate(state.rate);
    }
    const currentlyPlaying = target.getPlayerState() === 1;
    if (state.status !== currentlyPlaying) {
      state.status ? target.playVideo() : target.pauseVideo();
    }
    setIsVideoPlaying(state.status);
    setVideoSpeed(state.rate);
    window.setTimeout(() => { correctionRef.current = false; }, 900);
  }, [player]);

  useEffect(() => {
    const data = lastMessage?.data;
    if (!data) return;
    try {
      const message = JSON.parse(data);
      if (message.type === 'setPlaying') {
        const status = Boolean(message.status);
        setIsVideoPlaying(status);
        const target = player as YTPlayer | null;
        if (target && (target.getPlayerState() === 1) !== status) {
          correctionRef.current = true;
          status ? target.playVideo() : target.pauseVideo();
          window.setTimeout(() => { correctionRef.current = false; }, 900);
        }
      } else if (message.type === 'seeked') {
        correctionRef.current = true;
        player?.seekTo(message.time, 'seconds');
        window.setTimeout(() => { correctionRef.current = false; }, 900);
      } else if (message.type === 'syncState') {
        if (Number.isFinite(message.position) && Number.isFinite(message.rate)) {
          applySyncState({ position: message.position, status: Boolean(message.status), rate: message.rate });
        }
      } else if (message.type === 'setVideo') {
        const nextUrl = message.url || `https://www.youtube.com/watch?v=${message.videoId}`;
        setVideoUrl(nextUrl);
        setIsVideoPlaying(true);
        sendMessage(JSON.stringify({ type: 'setPlaying', status: true, roomId: room_id, broadcast: true }));
      } else if (message.type === 'setPlaybackRate') {
        setVideoSpeed(message.rate);
        const target = player as YTPlayer | null;
        if (target && target.getPlaybackRate() !== message.rate) target.setPlaybackRate(message.rate);
      }
    } catch { /* Ignore malformed websocket payloads. */ }
  }, [lastMessage, player, room_id, sendMessage, applySyncState]);

  useEffect(() => {
    if (player && pendingSyncRef.current) applySyncState(pendingSyncRef.current);
  }, [player, applySyncState]);

  return (
    <div className="youtube-player-frame">
            <YouTubePlayer
              className="react-player"
              ref={setPlayer}
              width="100%"
              height="100%"
              url={videoUrl}
              playing={isVideoPlaying}
              playbackRate={videoSpeed}
              config={{ playerVars: { controls: 1, cc_load_policy: 0, origin: window.location.origin, playsinline: 1 } }}
              onPlay={() => {
                setIsVideoPlaying(true);
                if (!correctionRef.current && lastSentPlayingRef.current !== true) {
                  lastSentPlayingRef.current = true;
                  sendMessage(JSON.stringify({ type: 'setPlaying', status: true, roomId: room_id, broadcast: true }));
                }
              }}
              onPause={() => {
                setIsVideoPlaying(false);
                if (!correctionRef.current && lastSentPlayingRef.current !== false) {
                  lastSentPlayingRef.current = false;
                  sendMessage(JSON.stringify({ type: 'setPlaying', status: false, roomId: room_id, broadcast: true }));
                }
              }}
              onReady={(_readyPlayer) => {
                if (pendingSyncRef.current) applySyncState(pendingSyncRef.current);
              }}
              onSeek={(time) => {
                if (!correctionRef.current) {
                  sendMessage(JSON.stringify({ type: 'seeked', time, roomId: room_id }));
                }
              }}
              onRateChange={(rate: number) => {
                if (!correctionRef.current) {
                  setVideoSpeed(rate);
                  sendMessage(JSON.stringify({ type: 'setPlaybackRate', rate, roomId: room_id, broadcast: true }));
                }
              }}
            />
    </div>
  );
}
