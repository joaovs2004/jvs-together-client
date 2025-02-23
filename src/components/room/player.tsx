import { Card, CardContent } from '@/components/ui/card';
import ReactPlayer from 'react-player/youtube';
import YoutubePlayerControls from './controls';
import { useEffect, useState } from 'react';
import YouTubePlayer from 'react-player/youtube';
import { useWebSocketContext } from '@/websocket-context';

export default function Player({ room_id }: { room_id: string }) {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoSpeed, setVideoSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(50);
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/watch?v=LXb3EKWsInQ");

  const { sendMessage, lastMessage } = useWebSocketContext();

  useEffect(() => {
    const messageData = lastMessage?.data;

    if (messageData) {
      const jsonMessageData = JSON.parse(messageData);

      if (jsonMessageData.type == "setPlaying") {
        setIsVideoPlaying(jsonMessageData.status);
      } else if(jsonMessageData.type == "seeked") {
        player?.seekTo(jsonMessageData.time);
      } else if(jsonMessageData.type == "setVideo") {
        setVideoUrl(`https://www.youtube.com/watch?v=${jsonMessageData.videoId}`);
      } else if(jsonMessageData.type == "setPlaybackRate") {
        setVideoSpeed(jsonMessageData.rate);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  function handlePlayPause() {
    const isPlaying = !isVideoPlaying;
    sendMessage(JSON.stringify({ type: "setPlaying", status: isPlaying, roomId: room_id, broadcast: true }));
  };

  return (
    <div className="lg:col-span-3">
      <Card className="bg-white rounded-none border-gray-200 dark:bg-zinc-900 dark:border-zinc-800 player">
        <CardContent className="p-0">
          <div className="aspect-video bg-gray-100 dark:bg-zinc-900 flex items-center justify-center text-gray-800 dark:text-zinc-100">
            <ReactPlayer
              className='react-player'
              ref={(ref) => {setPlayer(ref)}}
              width="100%"
              height="100%"
              url={videoUrl}
              playing={isVideoPlaying}
              volume={volume}
              playbackRate={videoSpeed}
              onDuration={(duration) => { setVideoDuration(duration) }}
              onProgress={(progress) => {setCurrentTime(progress.playedSeconds)}}
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
              onPlayButtonClick={handlePlayPause}
            />
        </CardContent>
      </Card>
    </div>
  );
};
