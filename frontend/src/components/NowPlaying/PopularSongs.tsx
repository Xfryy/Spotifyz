import { Song } from "@/types";
import { Clock } from "lucide-react";

interface PopularSongsProps {
  songs: Song[];
}

export const PopularSongs = ({ songs }: PopularSongsProps) => {
  return (
    <div className="p-6 border-t border-zinc-800">
      <h3 className="text-white font-semibold text-lg mb-4">Popular Songs</h3>
      <div className="space-y-2">
        {songs.slice(0, 5).map((song, index) => (
          <div 
            key={song._id}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800/50 group cursor-pointer"
          >
            <div className="w-4 text-sm text-zinc-400">{index + 1}</div>
            <img 
              src={song.imageUrl} 
              alt={song.title}
              className="w-10 h-10 rounded" 
            />
            <div className="flex-1 min-w-0">
              <div className="text-white truncate">{song.title}</div>
              <div className="text-sm text-zinc-400">{song.plays?.toLocaleString() || 0} plays</div>
            </div>
            <div className="text-zinc-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
