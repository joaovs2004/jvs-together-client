import { Card, CardContent } from '@/components/ui/card';
import ReactPlayer from 'react-player/youtube';
import YoutubePlayerControls from './controls';
import { SendMessage } from 'react-use-websocket';
import { useState } from 'react';
import YouTubePlayer from 'react-player/youtube';

export default function Player({ sendMessageFunction }: {sendMessageFunction: SendMessage}) {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(50);

  function handlePlayPause() {
    setIsVideoPlaying(!isVideoPlaying);
    sendMessageFunction(JSON.stringify({ type: "setPlaying", status: isVideoPlaying, roomId: "teste", broadcast: true }));
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
              url='https://www.youtube.com/watch?v=LXb3EKWsInQ'
              playing={isVideoPlaying}
              volume={volume}
              onDuration={(duration) => { setVideoDuration(duration) }}
              onProgress={(a) => {setCurrentTime(a.playedSeconds)}}
            />
          </div>
            <YoutubePlayerControls
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
