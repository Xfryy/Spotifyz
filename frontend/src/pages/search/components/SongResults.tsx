import { Song } from "@/types";
import { Clock, Music, Play } from "lucide-react";
import { useState } from "react";
import { useMusicStore } from "@/stores/useMusicStore";

type SongListProps = {
  songs: Song[];
  isLoading: boolean;
  onPlaySong?: (index: number) => void;
};

const SongList = ({ songs, isLoading, onPlaySong }: SongListProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { albums } = useMusicStore();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-zinc-800/40 rounded-md animate-pulse" />
        ))}
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-md overflow-hidden">
      <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 border-b border-zinc-800">
        <div className="w-4">#</div>
        <div>Title</div>
        <div className="hidden md:block">Album</div>
        <div className="flex justify-end">
          <Clock className="h-4 w-4" />
        </div>
      </div>

      {songs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Music className="h-12 w-12 text-zinc-500 mb-2" />
          <p className="text-zinc-500">No songs found</p>
        </div>
      ) : (
        songs.map((song, index) => (
          <div
            key={song._id}
            className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800/40 group rounded-md transition-colors duration-200 cursor-pointer"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => onPlaySong && onPlaySong(index)}
          >
            <div className="flex items-center justify-center w-4">
              {hoveredIndex === index ? (
                <Play className="h-3 w-3 text-white" />
              ) : (
                <span className="text-zinc-400">{index + 1}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <img src={song.imageUrl} alt={song.title} className="w-full h-full object-cover rounded-sm" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Play className="h-4 w-4 text-white" />
                </div>
              </div>
              <div>
                <p className="font-medium text-white truncate">{song.title}</p>
                <p className="text-xs truncate text-zinc-400 hover:text-white transition-colors duration-200">{song.artist}</p>
              </div>
            </div>
            <div className=" items-center hidden md:block">
              {albums.find((album) => album._id === song.albumId)?.title || "Single"}
            </div>
            <div className="flex items-center justify-end">{formatDuration(song.duration)}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default SongList;
