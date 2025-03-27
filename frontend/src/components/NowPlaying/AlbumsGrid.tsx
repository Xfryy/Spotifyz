import { Album } from "@/types";
import { Disc } from "lucide-react";
import { Link } from "react-router-dom";

interface AlbumsGridProps {
  artist: string;
  albums: Album[];
}

export const AlbumsGrid = ({ artist, albums }: AlbumsGridProps) => {
  return (
    <div className="p-6 border-t border-zinc-800">
      <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
        <Disc className="w-5 h-5 text-zinc-400" />
        Albums by {artist}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {albums.map((album) => (
          <Link
            key={album._id}
            to={`/albums/${album._id}`}
            className="bg-zinc-800/50 rounded-md p-3 hover:bg-zinc-700/50 transition-colors group"
          >
            <div className="flex gap-3">
              <img 
                src={album.imageUrl} 
                alt={album.title}
                className="w-16 h-16 rounded object-cover" 
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate group-hover:text-green-400">
                  {album.title}
                </h4>
                <p className="text-sm text-zinc-400">
                  {album.releaseYear} • {album.songs?.length || 0} songs
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
