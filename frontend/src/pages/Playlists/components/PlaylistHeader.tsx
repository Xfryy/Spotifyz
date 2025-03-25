import { ListMusic } from "lucide-react";
import { Button } from "@/components/ui/button";

const PlaylistHeader = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <ListMusic className="size-8 text-green-400" />
          Your Libary
        </h1>
        <p className="text-zinc-400">All the playlists you've created and added</p>
      </div>
      
      <Button 
        className="bg-green-500 hover:bg-green-400 text-black font-bold rounded-full px-6 py-2 flex items-center gap-2 hover:scale-105 transition-all"
      >
        <span className="text-xl font-bold">+</span>
        <span>Create Playlist</span>
      </Button>
    </div>
  );
};

export default PlaylistHeader;