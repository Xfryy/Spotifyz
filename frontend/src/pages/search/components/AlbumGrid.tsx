// D:\Spotifyz\frontend\src\pages\search\components\AlbumGrid.tsx
import { Album } from "@/types"; // You'll need to create this type
import { Link } from "react-router-dom";
import { Stars } from "lucide-react";

interface AlbumGridProps {
  albums: Album[];
}

const AlbumGrid = ({ albums }: AlbumGridProps) => {
  if (albums.length === 0) return null;
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center">
        <Stars className="mr-2 text-blue-400" size={18} />
        Collections albums
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {albums.map((album) => (
          <Link
            key={album._id}
            to={`/albums/${album._id}`}
            className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group enchanted-album"
          >
            <div className="aspect-square mb-4 overflow-hidden rounded-md relative">
              <img 
                src={album.imageUrl} 
                alt={album.title}
                className="w-full h-full object-cover rounded-md transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-opacity duration-300 rounded-md"></div>
            </div>
            <h3 className="font-medium text-white truncate group-hover:text-indigo-300 transition-colors duration-300">{album.title}</h3>
            <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">By {album.artist}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AlbumGrid;