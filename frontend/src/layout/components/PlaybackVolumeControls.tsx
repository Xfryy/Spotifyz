// layout/components/PlaybackVolumeControls.tsx
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Laptop2, VolumeX, Volume1, Volume2, Mic2 } from "lucide-react";
import { useEffect, useState, RefObject } from "react";

interface PlaybackVolumeControlsProps {
  audioRef: RefObject<HTMLAudioElement | null>;
}

export const PlaybackVolumeControls = ({ audioRef }: PlaybackVolumeControlsProps) => {
  const [volume, setVolume] = useState(75);
  const [prevVolume, setPrevVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Set initial volume when audio element is available
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [audioRef]);

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    
    // Update mute state based on volume
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        // Unmute - restore previous volume
        audioRef.current.volume = prevVolume / 100;
        setVolume(prevVolume);
      } else {
        // Mute - save current volume for later
        setPrevVolume(volume);
        audioRef.current.volume = 0;
        setVolume(0);
      }
      setIsMuted(!isMuted);
    }
  };

  // Function to get appropriate volume icon
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX className="h-4 w-4" />;
    } else if (volume < 50) {
      return <Volume1 className="h-4 w-4" />;
    } else {
      return <Volume2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="hidden sm:flex items-center gap-2 min-w-[180px] w-[30%] justify-end">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" className="hover:text-white text-zinc-400">
              <Mic2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">Lyrics</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" className="hover:text-white text-zinc-400">
              <Laptop2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">Connect to a device</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex items-center gap-2">
        <Button 
          size="icon" 
          variant="ghost" 
          className="hover:text-white text-zinc-400"
          onClick={toggleMute}
        >
          {getVolumeIcon()}
        </Button>
        <Slider
          value={[volume]}
          max={100}
          step={1}
          className="w-24"
          onValueChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};