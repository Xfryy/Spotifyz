import { Playlist } from "@/types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionGridSkeleton from "./SectionGridSkeleton";

interface PlaylistSectionProps {
  title: string;
  playlists: Playlist[];
  isLoading: boolean;
}

const PlaylistSection = ({ title, playlists, isLoading }: PlaylistSectionProps) => {
  if (isLoading) return <SectionGridSkeleton />;

  return (
    <div className='mb-8'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl sm:text-2xl font-bold'>{title}</h2>
        <Link to="/playlists">
          <Button variant='link' className='text-sm text-zinc-400 hover:text-white'>
            Show all
          </Button>
        </Link>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'>
        {playlists.map((playlist) => (
          <Link
            key={playlist._id}
            to={`/playlists/${playlist._id}`}
            className='bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group'
          >
            <div className='aspect-square mb-4 rounded-md overflow-hidden'>
              <img
                src={playlist.imageUrl}
                alt={playlist.title}
                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
              />
            </div>
            <h3 className='font-semibold text-white mb-1 truncate'>{playlist.title}</h3>
            <p className='text-sm text-zinc-400 truncate'>
              {playlist.songs.length} songs
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PlaylistSection;
