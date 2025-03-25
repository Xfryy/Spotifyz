// components/NowPlayingInfo.tsx
import { Button } from "@/components/ui/button";
import { Share2, Heart, Download, Play } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/useAuthStore";
import toast from "react-hot-toast";

interface NowPlayingInfoProps {
  currentSong: {
    _id: string;
    title: string;
    artist: string;
    imageUrl: string;
    audioUrl: string;
  } | null;
}

export const NowPlayingInfo = ({ currentSong }: NowPlayingInfoProps) => {
  const { isPro } = useAuthStore();
  const [isLiked, setIsLiked] = useState(false);

  const handleDownload = async () => {
    if (!currentSong) return;
    
    try {
      const link = document.createElement('a');
      link.href = currentSong.audioUrl;
      link.download = `${currentSong.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started!");
    } catch (error) {
      toast.error("Failed to download song");
    }
  };

  if (!currentSong) {
    return (
      <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]">
        <div className="relative group">
          <img
            src="/hu-tao.gif"
            alt="Hu Tao"
            className="w-14 h-14 object-cover rounded-md shadow-md"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">
            <Play className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-white">
            Spotifyz
          </div>
          <div className="text-sm text-zinc-400">
            Play some music!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]">
      <div className="relative group">
        <img
          src={currentSong.imageUrl}
          alt={currentSong.title}
          className="w-14 h-14 object-cover rounded-md shadow-md"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="font-medium truncate hover:underline cursor-pointer text-white">
            {currentSong.title}
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            className={`hover:text-white ${isLiked ? 'text-spotify-green' : 'text-zinc-400'}`}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-spotify-green' : ''}`} />
          </Button>
          {/* Download button - Only show for Pro users */}
          {isPro && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="hover:text-white text-zinc-400"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">Download song</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="text-sm text-zinc-400 truncate hover:underline cursor-pointer">
          {currentSong.artist}
        </div>
      </div>
    </div>
  );
};