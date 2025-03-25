import { Button } from "@/components/ui/button";
import { Heart, MoreHorizontal, Pause, Play, Share2, Download, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface PlaylistControlsProps {
  isOwner: boolean;
  isSongCurrentlyPlaying?: boolean;
  isCurrentlyPlaying?: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onAddSong: (e: React.MouseEvent) => void; // Update type to include event
  onDeletePlaylist: () => void;
}

const PlaylistControls = ({ isOwner, isSongCurrentlyPlaying, isPlaying, onPlay, onAddSong, onDeletePlaylist }: PlaylistControlsProps) => {
  return (
    <div className="px-8 py-6 flex flex-col gap-5 bg-gradient-to-b from-transparent to-zinc-900/95">
      {/* Main Controls Row */}
      <div className="flex items-center gap-8">
        <Button
          onClick={onPlay}
          size="icon"
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all shadow-xl flex items-center justify-center"
        >
          {isSongCurrentlyPlaying && isPlaying ? (
            <Pause className="h-7 w-7 text-black" />
          ) : (
            <Play className="h-7 w-7 text-black ml-1" />
          )}
        </Button>

        <Button size="icon" className="text-zinc-400 hover:text-green-400 transition-colors duration-300 bg-transparent" aria-label="Like">
          <Heart className="h-8 w-8" />
        </Button>
        
        <Button size="icon" className="text-zinc-400 hover:text-white transition-colors duration-300 bg-transparent" aria-label="Download">
          <Download className="h-7 w-7" />
        </Button>
        
        <Button size="icon" className="text-zinc-400 hover:text-white transition-colors duration-300 bg-transparent" aria-label="Share">
          <Share2 className="h-7 w-7" />
        </Button>
        
        <DropdownMenu modal={false}> {/* Add modal={false} */}
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="text-zinc-400 hover:text-white transition-colors duration-300 bg-transparent"
            >
              <MoreHorizontal className="h-8 w-8" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-64 bg-zinc-800 border-zinc-700 rounded-md shadow-xl p-1"
            onClick={(e) => e.stopPropagation()}
          >
            {isOwner && (
              <>
                <DropdownMenuItem 
                  onClick={onAddSong}
                  className="text-white hover:bg-zinc-700 cursor-pointer py-3 px-4 rounded-sm text-sm font-medium"
                >
                  Add to this playlist
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={onDeletePlaylist}
                  className="text-white hover:bg-zinc-700 cursor-pointer py-3 px-4 rounded-sm text-sm font-medium"
                >
                  Delete playlist
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem className="text-white hover:bg-zinc-700 cursor-pointer py-3 px-4 rounded-sm text-sm font-medium">
              Add to queue
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-zinc-700 cursor-pointer py-3 px-4 rounded-sm text-sm font-medium">
              Add to another playlist
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Song Table Header (Spotify-like) */}
      <div className="border-b border-white/10 pb-2 mt-4 grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 text-xs uppercase tracking-wider text-zinc-400 font-medium">
        <div className="flex items-center">#</div>
        <div>Title</div>
        <div>Date added</div>
        <div className="flex justify-end">
          <Clock className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default PlaylistControls;
