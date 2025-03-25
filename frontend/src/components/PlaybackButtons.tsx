// components/PlaybackButtons.tsx
import { Button } from "@/components/ui/button";
import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

interface PlaybackButtonsProps {
  isPlaying: boolean;
  currentSong: any;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  isRepeatOn: boolean;
  setIsRepeatOn: (value: boolean) => void;
}

export const PlaybackButtons = ({ 
  isPlaying, 
  currentSong, 
  togglePlay, 
  playNext, 
  playPrevious,
  isRepeatOn,
  setIsRepeatOn
}: PlaybackButtonsProps) => {
  const [isShuffleOn, setIsShuffleOn] = useState(false);

  return (
    <div className="flex items-center gap-4 sm:gap-6">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className={`hidden sm:inline-flex hover:text-white ${isShuffleOn ? 'text-spotify-green' : 'text-zinc-400'}`}
              onClick={() => setIsShuffleOn(!isShuffleOn)}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">{isShuffleOn ? 'Disable' : 'Enable'} shuffle</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="hover:text-white text-zinc-400"
              onClick={playPrevious}
              disabled={!currentSong}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">Previous</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Button
        size="icon"
        className="bg-white hover:bg-white/90 text-black rounded-full h-8 w-8 transition-transform hover:scale-105"
        onClick={togglePlay}
        disabled={!currentSong}
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
      </Button>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="hover:text-white text-zinc-400"
              onClick={playNext}
              disabled={!currentSong}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">Next</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className={`hidden sm:inline-flex hover:text-white ${isRepeatOn ? 'text-spotify-green' : 'text-zinc-400'}`}
              onClick={() => setIsRepeatOn(!isRepeatOn)}
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">{isRepeatOn ? 'Disable' : 'Enable'} repeat</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};