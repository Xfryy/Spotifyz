import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Playlist } from "@/types";
import { MoreVertical, Pause, Play } from "lucide-react";

interface PlaylistCardProps {
  playlist: Playlist;
  isOwner: boolean;
}

const PlaylistCard = ({ playlist, isOwner }: PlaylistCardProps) => {
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

  const isCurrentlyPlaying = playlist.songs.some(song => song._id === currentSong?._id);

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    if (playlist.songs.length > 0) {
      if (isCurrentlyPlaying) {
        togglePlay();
      } else {
        playAlbum(playlist.songs);
      }
    }
  };

  return (
    <div className='bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group relative'>
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
          size='icon'
          onClick={handlePlay}
          disabled={playlist.songs.length === 0}
          className={`absolute bottom-2 right-2 rounded-full shadow-xl h-12 w-12 
            ${isCurrentlyPlaying && isPlaying ? 'bg-green-500' : 'bg-green-500'} 
            hover:bg-green-400 hover:scale-105
            opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0
            transition-all duration-300
          `}
        >
          {isCurrentlyPlaying && isPlaying ? (
            <Pause className='size-5 text-black' />
          ) : (
            <Play className='size-5 text-black ml-0.5' />
          )}
        </Button>
      </div>

      <div>
        <h3 className='font-semibold text-white mb-1 truncate group-hover:text-green-400 transition-colors'>
          {playlist.title}
        </h3>
        <div className='text-sm text-zinc-400 truncate'>
          {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'} • {isOwner ? "Your playlist" : `By ${playlist.ownerName}`}
        </div>
      </div>

      {isOwner && (
        <Button
          variant='ghost'
          size='icon'
          className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-white hover:bg-zinc-700'
        >
          <MoreVertical className='size-4' />
        </Button>
      )}
    </div>
  );
};

export default PlaylistCard;
