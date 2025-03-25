// EmptyPlaylists.tsx - With Spotify-like styling
import { ListMusic } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyPlaylists = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 bg-zinc-800 p-8 rounded-full">
        <ListMusic className="size-12 text-green-400" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">Create your first playlist</h3>
      <p className="text-zinc-400 max-w-md mb-8">
        It's easy to organize your favorite music into playlists. We'll help you create your first playlist.
      </p>
      <Button className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-6 rounded-full hover:scale-105 transition-transform">
        Create Playlist
      </Button>
    </div>
  );
};

export default EmptyPlaylists;