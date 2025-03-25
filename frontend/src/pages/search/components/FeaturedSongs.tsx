// D:\Spotifyz\frontend\src\pages\search\components\FeaturedSongs.tsx
import { Song } from "@/types"; // You'll need to create this type
import { Sparkles } from "lucide-react";
import PlayButton from "@/pages/home/components/PlayButton";

interface FeaturedSongsProps {
  songs: Song[];
}

const FeaturedSongs = ({ songs }: FeaturedSongsProps) => {
  if (songs.length === 0) return null;
  
  return (
    <div className="pb-8">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center">
        <Sparkles className="mr-2 text-blue-400" size={18} />
        Recent Enchantments
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {songs.map((song) => (
          <div 
            key={song._id} 
            className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer enchanted-recent"
          >
            <div className="relative mb-4">
              <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                <img 
                  src={song.imageUrl} 
                  alt={song.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-opacity duration-300"></div>
              </div>
              <PlayButton song={song} />
            </div>
            <h3 className="font-medium mb-2 truncate group-hover:text-blue-300 transition-colors duration-300">{song.title}</h3>
            <p className="text-sm text-zinc-400 truncate group-hover:text-zinc-300 transition-colors duration-300">{song.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedSongs;