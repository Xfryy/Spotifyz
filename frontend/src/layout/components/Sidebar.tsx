import { cn } from "@/lib/utils";
import { Home, Library, Search, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import CreatePlaylistDialog from "@/components/CreatePlaylistDialog";

const Sidebar = () => {
  const { pathname } = useLocation();
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);

  return (
    <div className="flex flex-col gap-2 p-2">
      <Link
        to="/"
        className={cn(
          "flex items-center gap-2 text-zinc-400 hover:text-white transition-colors",
          pathname === "/" && "text-white"
        )}
      >
        <Home className="h-5 w-5" />
        <span>Home</span>
      </Link>
      <Link
        to="/search"
        className={cn(
          "flex items-center gap-2 text-zinc-400 hover:text-white transition-colors",
          pathname === "/search" && "text-white"
        )}
      >
        <Search className="h-5 w-5" />
        <span>Search</span>
      </Link>
      <Link
        to="/explore"
        className={cn(
          "flex items-center gap-2 text-zinc-400 hover:text-white transition-colors",
          pathname === "/explore" && "text-white"
        )}
      >
        <Users className="h-5 w-5" />
        <span>Explore</span>
      </Link>
      <button
        onClick={() => setShowCreatePlaylist(true)}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
      >
        <Library className="h-5 w-5" />
        <span>Create Playlist</span>
      </button>
      <CreatePlaylistDialog
        isOpen={showCreatePlaylist}
        onClose={() => setShowCreatePlaylist(false)}
      />
    </div>
  );
};

export default Sidebar;