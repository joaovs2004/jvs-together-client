import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import screenfull from 'screenfull'
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  PlayIcon,
  PauseIcon,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import YouTubePlayer from 'react-player/youtube';

interface YoutubePlayerControlsProps {
  player: YouTubePlayer | null;
  isPlaying: boolean;
  duration: number;
  volume: number;
  currentTime: number;
  setCurrentTime: Dispatch<SetStateAction<number>>;
  setVolume: Dispatch<SetStateAction<number>>;
  onPlayButtonClick: () => void;
}

export default function YoutubePlayerControls(
  {
    player,
    isPlaying,
    duration,
    volume,
    currentTime,
    setCurrentTime,
    setVolume,
    onPlayButtonClick
  }:
  YoutubePlayerControlsProps
) {
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Format time as MM:SS
  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  function handleVolumeChange(value) {
    setVolume(value[0]);

    if (value[0] === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  function handleSeek(value) {
    setCurrentTime(value[0]);
    player?.seekTo(value)
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  function handleFullscreenChange() {
    if (document.fullscreenElement) {
      setIsFullscreen(true);
    } else {
      setIsFullscreen(false);
    }
  };

  function toggleFullscreen() {
    const player = document.querySelector('.player');

    if (!isFullscreen) {
      player?.requestFullscreen({navigationUI: "hide"})
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className={`w-full bg-black bg-opacity-80 p-2 text-white controls ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            min={0}
            max={duration}
            step={1}
            onValueChange={handleSeek}
            className="flex-1"
          />
          <span className="text-xs">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onPlayButtonClick}
                    className="text-white hover:bg-white hover:bg-opacity-20"
                  >
                    {isPlaying ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isPlaying ? 'Pause' : 'Play'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex items-center gap-2 w-32">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-20"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white hover:bg-opacity-20"
                      >
                        <Settings size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Playback Speed</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => console.log("Speed 0.25x")}>0.25x</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => console.log("Speed 0.5x")}>0.5x</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => console.log("Speed 1x")}>Normal (1x)</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => console.log("Speed 1.5x")}>1.5x</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => console.log("Speed 2x")}>2x</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white hover:bg-opacity-20 fullScreen"
                  >
                  {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
