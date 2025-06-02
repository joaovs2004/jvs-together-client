import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  PlayIcon,
  PauseIcon,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Clock
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
import { useWebSocketContext } from '@/websocket-context';

interface YoutubePlayerControlsProps {
  room_id: string;
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
    room_id,
    player,
    isPlaying,
    duration,
    volume,
    currentTime,
    setCurrentTime,
    setVolume,
    onPlayButtonClick,
  }:
  YoutubePlayerControlsProps
) {
  const videoSpeeds = [0.25, 0.5, 0.75, 1, 1.5, 1.75, 2];
  const [previousVolume, setPreviousVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSeekbarTooltip, setShowSeekbarTooltip] = useState(false);
  const [seekbarTooltipValue, setSeekbarTooltipValue] = useState(0);
  const [seekbarTooltipPosition, setSeekbarTooltipPosition] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { sendMessage } = useWebSocketContext();

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    const previousVolume = localStorage.getItem("previousVolume");
    const isMuted = localStorage.getItem("isMuted");

    if (previousVolume) setPreviousVolume(Number(previousVolume));

    if (isMuted == "true") {
      setVolume(0);
      setIsMuted(true);
    } else if (previousVolume) {
      setVolume(Number(previousVolume));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyBindings);
    return () => {
      document.removeEventListener('keydown', handleKeyBindings);
    };
  }, [handleKeyBindings]);

  // Format time as HH:MM:SS
  function formatTime(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const hoursField = hrs > 0 ? `${hrs}:` : '';
    const minutesField = hrs > 0 ? String(mins).padStart(2, '0') : String(mins);
    const secondsField = String(secs).padStart(2, '0');

    return `${hoursField}${minutesField}:${secondsField}`;
  }

  function handleKeyBindings(event: KeyboardEvent) {
    switch (event.key) {
      case "f":
        toggleFullscreen();
        break;
      case " ":
        onPlayButtonClick();
        break;
    }
  }

  function handleVolumeChange(value: number[]) {
    const newVolume = value[0];
    setVolume(newVolume);

    localStorage.setItem("previousVolume", newVolume.toString());

    if (value[0] === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  function handleSeek(value: number[]) {
    setShowSeekbarTooltip(false);
    setCurrentTime(value[0])
    player?.seekTo(value[0])
  };

  function sendSeek() {
    sendMessage(JSON.stringify({ type: "seeked", time: currentTime, roomId: room_id }));
  }

  function toggleMute() {
    setIsMuted(!isMuted);

    localStorage.setItem("isMuted", !isMuted ? "true" : "false");

    if (!isMuted) {
      setPreviousVolume(volume);
      setVolume(0);
    } else {
      setVolume(previousVolume);
    }
  };

  function handleVideoSpeedChange(speed: number) {
    sendMessage(JSON.stringify({ type: "setPlaybackRate", rate: speed, roomId: room_id, broadcast: true }));
  }

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
      player?.requestFullscreen({navigationUI: "hide"});
    } else {
      document.exitFullscreen();
    }
  };

  function handleSeekbarTooltip(event: React.MouseEvent) {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    const hoverTime = Math.round((percentage / 100) * duration);

    setSeekbarTooltipValue(hoverTime);
    setSeekbarTooltipPosition(percentage);
  }

  return (
    <div className={`w-full bg-black bg-opacity-80 p-2 text-white controls ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs">{formatTime(currentTime)}</span>

          <div
            className="relative w-full cursor-pointer"
            ref={sliderRef}
            onMouseMove={(event) => handleSeekbarTooltip(event)}
            onMouseEnter={() => setShowSeekbarTooltip(true)}
            onMouseLeave={() => setShowSeekbarTooltip(false)}
          >
            {showSeekbarTooltip && (
              <div
                className="absolute -top-2 transform -translate-y-full bg-black text-white px-2 py-1 rounded text-sm"
                style={{ left: `${seekbarTooltipPosition}%`, transform: 'translateX(-50%)' }}
              >
                {formatTime(seekbarTooltipValue)}
              </div>
            )}

            <Slider
              value={[currentTime]}
              min={0}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              onValueCommit={sendSeek}
              className="flex-1"
            />
          </div>

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
                    onKeyDown={(e) => {
                      if (e.code === "Space") {
                        e.preventDefault();
                      }
                    }}
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
                className="text-white hover:bg-white hover:bg-opacity-20 cursor-pointer"
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-20 cursor-pointer"
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
                        <Clock size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Playback Speed</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent>
                {videoSpeeds.map((speed, index) => (
                  <DropdownMenuItem key={index} onSelect={() => handleVideoSpeedChange(speed)}>{speed}</DropdownMenuItem>
                ))}
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
