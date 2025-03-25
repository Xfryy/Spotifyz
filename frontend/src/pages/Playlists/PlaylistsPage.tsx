import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { useUser } from "@clerk/clerk-react";
import PlaylistGrid from "./components/PlaylistGrid";
import PlaylistHeader from "./components/PlaylistHeader";
import EmptyPlaylists from "./components/EmptyPlaylists";

const PlaylistsPage = () => {
  const { playlists, fetchPlaylists, isLoading } = usePlaylistStore();
  const { user } = useUser();

  useEffect(() => {
    if (user) fetchPlaylists();
  }, [fetchPlaylists, user]);

  return (
    <main className="bg-gradient-to-b from-zinc-800 to-zinc-900">
      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="px-6 py-8">
          <PlaylistHeader />
          
          {playlists.length === 0 && !isLoading ? (
            <EmptyPlaylists />
          ) : (
            <PlaylistGrid playlists={playlists} isLoading={isLoading} />
          )}
        </div>
      </ScrollArea>
    </main>
  );
};

export default PlaylistsPage;
