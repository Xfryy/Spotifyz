import { Playlist } from "@/types";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";

interface PlaylistCardProps {
  playlist: Playlist;
}

const PlaylistCard = ({ playlist }: PlaylistCardProps) => {
  const { playAlbum, currentSong, togglePlay } = usePlayerStore();
  const isCurrentPlaylist = playlist.songs.some(song => song._id === currentSong?._id);

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    if (playlist.songs.length === 0) return;
    
    if (isCurrentPlaylist) {
      togglePlay();
    } else {
      playAlbum(playlist.songs);
    }
  };

  return (
    <Link
      to={`/playlists/${playlist._id}`}
      className='bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group relative'
    >
      <div className='relative mb-4'>
        <div className='aspect-square rounded-md shadow-lg overflow-hidden'>
          <img
            src={playlist.imageUrl}
            alt={playlist.title}
            className='w-full h-full object-cover transition-transform duration-300 
            group-hover:scale-105'
          />
        </div>
        
        <Button
          size="icon"
          onClick={handlePlay}
          disabled={playlist.songs.length === 0}
          className={`absolute bottom-2 right-2 rounded-full shadow-xl h-12 w-12 
            bg-green-500 hover:bg-green-400 hover:scale-105
            opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100
            transition-all duration-300
          `}
        >
          <Play className='h-6 w-6 text-black ml-1' />
        </Button>
      </div>

      <h3 className='font-semibold text-white mb-1 truncate'>{playlist.title}</h3>
      <div className='text-sm text-zinc-400'>
        <p className='truncate'>{playlist.songs.length} songs</p>
      </div>
    </Link>
  );
};

export default PlaylistCard;
