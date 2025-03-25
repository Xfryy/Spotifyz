// D:\Spotifyz\frontend\src\pages\search\components\TopResult.tsx
import { Song } from "@/types"; // You'll need to create this type

interface TopResultProps {
  song: Song;
  onPlay: () => void;
}

const TopResult = ({ song, onPlay }: TopResultProps) => {
  return (
    <div 
      className="bg-zinc-800/50 rounded-lg p-5 hover:bg-zinc-700/50 transition-all duration-300 group cursor-pointer enchanted-card"
      onClick={onPlay}
    >
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="relative w-36 h-36">
          <img 
            src={song.imageUrl} 
            alt={song.title} 
            className="w-full h-full rounded-md shadow-lg object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">{song.title}</h3>
            <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">Song • {song.artist}</p>
          </div>
          <div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg play-button-glow"
              onClick={(e) => {
                e.stopPropagation();
                onPlay();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopResult;