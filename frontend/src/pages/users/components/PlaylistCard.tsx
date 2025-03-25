import { Clock, Play } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaylistCardProps {
  id: string;
  title: string;
  image: string;
  songCount: number;
  createdAt: string;
}

const PlaylistCard = ({ id, title, image, songCount, createdAt }: PlaylistCardProps) => {
  return (
    <Link 
      to={`/playlists/${id}`}
      className="bg-zinc-800/40 rounded-md overflow-hidden hover:bg-zinc-700/40 transition-all group"
    >
      <div className="relative">
        <div className="aspect-square rounded-md overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Play button overlay */}
        <div className="absolute right-2 bottom-2 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button 
            className="bg-spotify-green rounded-full p-3 shadow-md hover:scale-105 transition"
            onClick={(e) => {
              e.preventDefault();
              // Handle play functionality here
            }}
          >
            <Play className="h-5 w-5 text-black fill-current" />
          </button>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-white truncate mb-1">{title}</h3>
        <div className="flex items-center justify-between text-sm text-zinc-400">
          <span>{songCount} songs</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(createdAt).toLocaleDateString(undefined, { 
              year: 'numeric', 
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PlaylistCard;