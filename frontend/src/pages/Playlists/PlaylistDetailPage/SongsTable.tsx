import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pause, Play } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Song {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  duration: number;
  createdAt?: string;
}

interface SongsTableProps {
  songs: Song[];
  currentSongId?: string;
  isPlaying: boolean;
  isOwner: boolean;
  onPlaySong: (index: number) => void;
  onRemoveSong: (songId: string) => void;
}

const SongsTable = ({ songs, currentSongId, isPlaying, isOwner, onPlaySong, onRemoveSong }: SongsTableProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Format: "Feb 24, 2025"
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  return (
    <div className="px-8 py-2 bg-gradient-to-b from-zinc-900/95 to-zinc-900/100">
      <div className="space-y-2">
        {songs.map((song, index) => (
          <div
            key={song._id}
            className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 p-2 rounded group hover:bg-white/10 transition-colors ${
              currentSongId === song._id ? "bg-white/20" : ""
            }`}
          >
            {/* Number/Play Column */}
            <div className="flex items-center justify-center w-4">
              {currentSongId === song._id && isPlaying ? (
                <Pause className="h-3 w-3 text-white" />
              ) : (
                <>
                  <span className="group-hover:hidden text-zinc-400 text-sm">
                    {index + 1}
                  </span>
                  <Play 
                    className="h-3 w-3 text-white hidden group-hover:block cursor-pointer" 
                    onClick={() => onPlaySong(index)}
                  />
                </>
              )}
            </div>

            {/* Song Info */}
            <div className="flex items-center gap-3 min-w-0">
              <img 
                src={song.imageUrl} 
                alt={song.title} 
                className="w-10 h-10 object-cover rounded"
              />
              <div className="truncate">
                <div className={`font-medium truncate ${
                  currentSongId === song._id ? "text-green-500" : "text-white"
                }`}>
                  {song.title}
                </div>
                <div className="text-sm text-zinc-400 hover:text-white hover:underline truncate">
                  {song.artist}
                </div>
              </div>
            </div>

            {/* Date Added */}
            <div className="flex items-center text-zinc-400 text-sm">
              {formatDate(song.createdAt)}
            </div>

            {/* Duration and Actions */}
            <div className="flex items-center justify-end gap-4">
              <span className="text-zinc-400 text-sm">
                {Math.floor(song.duration / 60)}:{String(Math.floor(song.duration % 60)).padStart(2, "0")}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8 rounded-full text-zinc-400 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-white hover:bg-zinc-800"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700 rounded-md shadow-xl p-1 w-56">
                  <DropdownMenuItem className="py-2 px-3 text-sm text-white hover:bg-white/10 rounded-sm">
                    Add to queue
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2 px-3 text-sm text-white hover:bg-white/10 rounded-sm">
                    Go to artist
                  </DropdownMenuItem>
                  {isOwner && (
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveSong(song._id);
                      }}
                      className="py-2 px-3 text-sm text-white hover:bg-white/10 rounded-sm"
                    >
                      Remove from playlist
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongsTable;
