// D:\Spotifyz\frontend\src\pages\search\components\PlaylistGrid.tsx
import { Playlist } from "@/types"; // You'll need to create this type
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface PlaylistGridProps {
  playlists: Playlist[];
}

const PlaylistGrid = ({ playlists }: PlaylistGridProps) => {
  if (playlists.length === 0) return null;
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center">
        <Sparkles className="mr-2 text-purple-400" size={18} />
        Public Playlists
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {playlists.map((playlist) => (
          <Link
            key={playlist._id}
            to={`/playlists/${playlist._id}`}
            className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group enchanted-playlist"
          >
            <div className="aspect-square mb-4 overflow-hidden rounded-md relative">
              <img 
                src={playlist.imageUrl} 
                alt={playlist.title}
                className="w-full h-full object-cover rounded-md transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-opacity duration-300 rounded-md"></div>
            </div>
            <h3 className="font-medium text-white truncate group-hover:text-purple-300 transition-colors duration-300">{playlist.title}</h3>
            <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">By {playlist.ownerName}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PlaylistGrid;