import { Card, CardContent } from '@/components/ui/card';
import ReactPlayer from 'react-player/youtube';
import YoutubePlayerControls from './controls';
import { useEffect, useRef, useState } from 'react';
import YouTubePlayer from 'react-player/youtube';
import { useWebSocketContext } from '@/websocket-context';

export interface CaptionTrack {
  languageCode: string;
  languageName?: string;
  name?: string;
}

export default function Player({ room_id }: { room_id: string }) {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoSpeed, setVideoSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(50);
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/watch?v=LXb3EKWsInQ");
  const [captionTracks, setCaptionTracks] = useState<CaptionTrack[]>([]);
  const [selectedCaptionLanguage, setSelectedCaptionLanguage] = useState<string | null>(null);
  const captionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const captionVideoUrlRef = useRef<string | null>(null);

  const { sendMessage, lastMessage } = useWebSocketContext();

  useEffect(() => {
    const messageData = lastMessage?.data;

    if (messageData) {
      const jsonMessageData = JSON.parse(messageData);

      if (jsonMessageData.type == "setPlaying") {
        setIsVideoPlaying(jsonMessageData.status);
      } else if (jsonMessageData.type == "seeked") {
        player?.seekTo(jsonMessageData.time);
      } else if (jsonMessageData.type == "setVideo") {
        setVideoUrl(`https://www.youtube.com/watch?v=${jsonMessageData.videoId}`);
        setIsVideoPlaying(true);
        sendMessage(JSON.stringify({ type: "setPlaying", status: true, roomId: room_id, broadcast: true }));
      } else if (jsonMessageData.type == "setPlaybackRate") {
        setVideoSpeed(jsonMessageData.rate);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  useEffect(() => () => {
    if (captionTimerRef.current) clearTimeout(captionTimerRef.current);
  }, []);

  function handlePlayPause() {
    const isPlaying = !isVideoPlaying;
    sendMessage(JSON.stringify({ type: "setPlaying", status: isPlaying, roomId: room_id, broadcast: true }));
  };

  function prepareCaptions(readyPlayer: Pick<ReactPlayer, 'getInternalPlayer'>) {
    const youtubePlayer = readyPlayer.getInternalPlayer();
    if (!youtubePlayer) return;

    if (captionTimerRef.current) clearTimeout(captionTimerRef.current);

    // Do not let the embedded YouTube player restore its own caption preference.
    youtubePlayer.unloadModule?.('captions');
    setCaptionTracks([]);
    setSelectedCaptionLanguage(null);
    youtubePlayer.loadModule?.('captions');

    const findTracks = (attempt = 0) => {
      const tracks = youtubePlayer.getOption?.('captions', 'tracklist');

      if (Array.isArray(tracks)) {
        setCaptionTracks(tracks);
        youtubePlayer.unloadModule?.('captions');
        return;
      }

      // The captions module is initialized by YouTube shortly after the video starts.
      if (attempt < 10) {
        captionTimerRef.current = setTimeout(() => findTracks(attempt + 1), 300);
      } else {
        youtubePlayer.unloadModule?.('captions');
      }
    };

    captionTimerRef.current = setTimeout(findTracks, 300);
  }

  function handleCaptionChange(languageCode: string | null) {
    const youtubePlayer = player?.getInternalPlayer();
    if (!youtubePlayer) return;

    if (languageCode) {
      youtubePlayer.loadModule?.('captions');
      youtubePlayer.setOption?.('captions', 'track', { languageCode });
    } else {
      youtubePlayer.unloadModule?.('captions');
    }

    setSelectedCaptionLanguage(languageCode);
  }

  function keepCaptionsDisabled() {
    if (selectedCaptionLanguage !== null) return;

    const youtubePlayer = player?.getInternalPlayer();
    youtubePlayer?.unloadModule?.('captions');
  }

  return (
    <div className="lg:col-span-3">
      <Card className="bg-white rounded-none border-gray-200 dark:bg-zinc-900 dark:border-zinc-800 player">
        <CardContent className="p-0">
          <div className="aspect-video bg-gray-100 dark:bg-zinc-900 flex items-center justify-center text-gray-800 dark:text-zinc-100">
            <ReactPlayer
              className='react-player'
              ref={(ref) => { setPlayer(ref) }}
              width="100%"
              height="100%"
              url={videoUrl}
              playing={isVideoPlaying}
              volume={volume}
              playbackRate={videoSpeed}
              config={{ playerVars: { cc_load_policy: 0 } }}
              onPlay={() => {
                keepCaptionsDisabled();
                setIsVideoPlaying(true);
                sendMessage(JSON.stringify({ type: "setPlaying", status: true, roomId: room_id, broadcast: true }));
              }}
              onPause={() => {
                setIsVideoPlaying(false);
                sendMessage(JSON.stringify({ type: "setPlaying", status: false, roomId: room_id, broadcast: true }));
              }}
              onReady={(readyPlayer) => {
                setVideoDuration(readyPlayer.getDuration());
                captionVideoUrlRef.current = videoUrl;
                prepareCaptions(readyPlayer);
              }}
              onProgress={(progress) => {
                setCurrentTime(progress.playedSeconds);

                if (captionVideoUrlRef.current !== videoUrl) {
                  captionVideoUrlRef.current = videoUrl;
                  if (player) prepareCaptions(player);
                }
              }}
            />
          </div>
          <YoutubePlayerControls
            room_id={room_id}
            player={player}
            isPlaying={isVideoPlaying}
            duration={videoDuration}
            volume={volume}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            setVolume={setVolume}
            captionTracks={captionTracks}
            selectedCaptionLanguage={selectedCaptionLanguage}
            onCaptionChange={handleCaptionChange}
            onPlayButtonClick={handlePlayPause}
          />
        </CardContent>
      </Card>
    </div>
  );
};
