import { Card, CardContent } from '@/components/ui/card';
import ReactPlayer from 'react-player/youtube';
import YoutubePlayerControls from './controls';
import { SendMessage } from 'react-use-websocket';
import { useState } from 'react';

export default function Player({ sendMessageFunction }: {sendMessageFunction: SendMessage}) {
  const [isPlaying, setIsPlaying] = useState(false);

  function handlePlayPause() {
    setIsPlaying(!isPlaying);
    sendMessageFunction(JSON.stringify({ type: "setPlaying", status: isPlaying, roomId: "teste", broadcast: true }));
  };

  return (
    <div className="lg:col-span-3">
      <Card className="bg-white rounded-none border-gray-200 dark:bg-zinc-900 dark:border-zinc-800 player">
        <CardContent className="p-0">
          <div className="aspect-video bg-gray-100 dark:bg-zinc-900 flex items-center justify-center text-gray-800 dark:text-zinc-100">
            <ReactPlayer
              className='react-player'
              width="100%"
              height="100%"
              url='https://www.youtube.com/watch?v=LXb3EKWsInQ'
              playing={isPlaying}
            />
          </div>
            <YoutubePlayerControls
              isPlaying={isPlaying}
              onPlayButtonClick={handlePlayPause}
            />
        </CardContent>
      </Card>
    </div>
  );
};
