import { usePlayerStore } from "@/stores/usePlayerStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { Album, Song } from "@/types";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { Clock, Disc, Heart, MoreHorizontal, Radio } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface NowPlayingViewProps {
  open: boolean;
  onClose: () => void;
}

export const NowPlayingView = ({ open, onClose }: NowPlayingViewProps) => {
  const { currentSong } = usePlayerStore();
  const { albums } = useMusicStore();
  
  // Get artist's albums
  const artistAlbums = albums.filter(album => album.artist === currentSong?.artist);

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

          {/* Artist Section */}
          <div className="p-6 border-t border-zinc-800">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Radio className="w-5 h-5 text-zinc-400" />
              About the Artist
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={currentSong.imageUrl} // Idealnya pakai artist image
                alt={currentSong.artist}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h4 className="text-white font-medium mb-1">{currentSong.artist}</h4>
                <p className="text-sm text-zinc-400">Artist • 1.2M monthly listeners</p>
              </div>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {currentSong.artist} is a talented musician known for their unique style and captivating performances.
            </p>
          </div>

          {/* Albums Section */}
          <div className="p-6 border-t border-zinc-800">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Disc className="w-5 h-5 text-zinc-400" />
              Albums by {currentSong.artist}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {artistAlbums.map((album) => (
                <Link
                  key={album._id}
                  to={`/albums/${album._id}`}
                  className="bg-zinc-800/50 rounded-md p-3 hover:bg-zinc-700/50 transition-colors group"
                >
                  <div className="flex gap-3">
                    <img 
                      src={album.imageUrl} 
                      alt={album.title}
                      className="w-16 h-16 rounded object-cover" 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate group-hover:text-green-400">
                        {album.title}
                      </h4>
                      <p className="text-sm text-zinc-400">
                        {album.releaseYear} • {album.songs?.length || 0} songs
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Songs Section */}
          <div className="p-6 border-t border-zinc-800">
            <h3 className="text-white font-semibold text-lg mb-4">Popular Songs</h3>
            <div className="space-y-2">
              {artistAlbums.flatMap(album => album.songs || []).slice(0, 5).map((song: Song, index) => (
                <div 
                  key={song._id}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800/50 group cursor-pointer"
                >
                  <div className="w-4 text-sm text-zinc-400">{index + 1}</div>
                  <img 
                    src={song.imageUrl} 
                    alt={song.title}
                    className="w-10 h-10 rounded" 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-white truncate">{song.title}</div>
                    <div className="text-sm text-zinc-400">{song.plays.toLocaleString()} plays</div>
                  </div>
                  <div className="text-zinc-400">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
