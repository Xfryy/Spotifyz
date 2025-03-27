import { usePlayerStore } from "@/stores/usePlayerStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArtistInfo } from "./ArtistInfo";
import { AlbumsGrid } from "./AlbumsGrid"; 
import { PopularSongs } from "./PopularSongs";

interface NowPlayingViewProps {
  open: boolean;
  onClose: () => void;
}

export const NowPlayingView = ({ open, onClose }: NowPlayingViewProps) => {
  const { currentSong } = usePlayerStore();
  const { albums } = useMusicStore();
  
  const artistAlbums = albums.filter(album => album.artist === currentSong?.artist);
  const allArtistSongs = artistAlbums.flatMap(album => album.songs || []);

  if (!currentSong) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[540px] bg-zinc-900 border-zinc-800 p-0">
        <ScrollArea className="h-full">
          {/* Hero Section */}
          <div className="p-8 bg-gradient-to-b from-zinc-800/80 to-zinc-900">
            <div className="flex items-start gap-6">
              <img
                src={currentSong.imageUrl}
                alt={currentSong.title}
                className="w-40 h-40 object-cover rounded-md shadow-xl"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-medium text-zinc-400 mb-1">Now Playing</h4>
                <h2 className="text-3xl font-bold text-white mb-2">{currentSong.title}</h2>
                <Link 
                  to={`/artists/${currentSong.artistId}`}
                  className="text-xl text-zinc-400 hover:text-white hover:underline"
                >
                  {currentSong.artist}
                </Link>
                
                <div className="flex gap-3 mt-4">
                  <Button size="icon" variant="ghost" className="rounded-full text-zinc-400 hover:text-green-400">
                    <Heart className="w-6 h-6" />
                  </Button>
                  <Button size="icon" variant="ghost" className="rounded-full text-zinc-400 hover:text-white">
                    <MoreHorizontal className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <ArtistInfo 
            artist={currentSong.artist}
            imageUrl={currentSong.imageUrl}
          />

          <AlbumsGrid 
            artist={currentSong.artist}
            albums={artistAlbums}
          />

          <PopularSongs songs={allArtistSongs} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
