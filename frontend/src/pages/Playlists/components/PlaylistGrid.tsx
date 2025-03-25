import { Playlist } from "@/types";
import PlaylistCard from "./PlaylistCard";
import PlaylistGridSkeleton from "@/components/skeletons/PlaylistGridSkeleton";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

interface PlaylistGridProps {
  playlists: Playlist[];
  isLoading: boolean;
}

const PlaylistGrid = ({ playlists, isLoading }: PlaylistGridProps) => {
  const { user } = useUser();

  if (isLoading) return <PlaylistGridSkeleton />;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {playlists.map((playlist) => (
        <Link 
          key={playlist._id}
          to={`/playlists/${playlist._id}`}
          className="block transition-transform hover:scale-[1.02]"
        >
          <PlaylistCard 
            playlist={playlist}
            isOwner={user?.id === playlist.owner}
          />
        </Link>
      ))}
    </div>
  );
};

export default PlaylistGrid;
