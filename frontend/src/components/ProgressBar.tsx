// components/ProgressBar.tsx
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/utils/formatTime";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (value: number[]) => void;
}

export const ProgressBar = ({ currentTime, duration, onSeek }: ProgressBarProps) => {
  // Calculate progress percentage for progress bar
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="hidden sm:flex items-center gap-2 w-full">
      <div className="text-xs text-zinc-400 min-w-[40px] text-right">{formatTime(currentTime)}</div>
      <div className="relative w-full h-1 group">
        <div className="absolute inset-0 h-1 bg-zinc-700/50 rounded-full">
          <div 
            className="absolute inset-y-0 left-0 bg-white group-hover:bg-spotify-green rounded-full transition-colors"
            style={{ width: `${progressPercentage}%` }}
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progressPercentage}%` }}
          />
        </div>
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          className="w-full hover:cursor-grab active:cursor-grabbing opacity-0"
          onValueChange={onSeek}
        />
      </div>
      <div className="text-xs text-zinc-400 min-w-[40px]">{formatTime(duration)}</div>
    </div>
  );
};