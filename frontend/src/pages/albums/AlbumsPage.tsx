import { useEffect, useState } from "react";
import { Link,  } from "react-router-dom";
import Header from "@/components/Topbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Disc } from "lucide-react";
import UpgradeModal from "@/components/UpgradeModal";

const SpotifyAlbumsPage = () => {
  const { albums, fetchAlbums, isLoading } = useMusicStore();
  const {  isPro } = useAuthStore();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  // Navigation handlers

  // Group albums by artist for the "Top Albums" section
  const getTopAlbums = () => {
    if (!albums || albums.length === 0) return [];
    // For demo purposes, just take the first 4 albums or less
    return albums.slice(0, Math.min(4, albums.length));
  };

  const topAlbums = getTopAlbums();

  // Get recently added albums
  const getRecentAlbums = () => {
    if (!albums || albums.length === 0) return [];
    // Sort by newest and take 5
    return [...albums]
      .sort((a, b) => b.releaseYear - a.releaseYear)
      .slice(0, 5);
  };
  
  const recentAlbums = getRecentAlbums();

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
      <Header setShowUpgradeModal={setShowUpgradeModal} />
      <ScrollArea className="h-full">
        <div className="container px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <Disc className="mr-3 size-7" />
              Albums
            </h1>
            <p className="text-zinc-400">Discover new music and your favorite albums</p>
          </div>

          {/* Featured Album Section */}
          {!isLoading && albums.length > 0 && (
            <div className="mb-10">
              <div className="bg-gradient-to-r from-emerald-900/70 to-blue-900/60 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="aspect-square w-40 md:w-52 overflow-hidden rounded-md shadow-2xl">
                  <img 
                    src={albums[0].imageUrl} 
                    alt={albums[0].title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-white font-bold">Featured Album</span>
                  <h2 className="text-4xl font-bold text-white my-2">{albums[0].title}</h2>
                  <p className="text-zinc-300 mb-4">{albums[0].artist} • {albums[0].releaseYear}</p>
                  <Link 
                    to={`/albums/${albums[0]._id}`}
                    className="bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-6 rounded-full w-fit transition-colors"
                  >
                    Listen Now
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Top Albums Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">Top Albums</h2>
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="bg-zinc-800 rounded-lg p-4 animate-pulse h-64"></div>
                ))}
              </div>
            ) : topAlbums.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {topAlbums.map((album) => (
                  <Link
                    to={`/albums/${album._id}`}
                    key={album._id}
                    className="group bg-zinc-800/50 rounded-lg p-4 hover:bg-zinc-700/50 transition-all duration-300"
                  >
                    <div className="aspect-square overflow-hidden rounded-md mb-4 shadow-md">
                      <img
                        src={album.imageUrl}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-white text-lg">{album.title}</h3>
                    <p className="text-zinc-400 text-sm">{album.artist}</p>
                    <p className="text-zinc-500 text-xs">{album.releaseYear}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-zinc-400 text-center p-8 bg-zinc-800/30 rounded-lg">
                No top albums found
              </div>
            )}
          </div>

          {/* Recently Added Section */}
          {!isLoading && recentAlbums.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-white mb-4">Recently Added</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {recentAlbums.map((album) => (
                  <Link
                    to={`/albums/${album._id}`}
                    key={`recent-${album._id}`}
                    className="group bg-zinc-800/50 rounded-lg p-4 hover:bg-zinc-700/50 transition-all duration-300"
                  >
                    <div className="aspect-square overflow-hidden rounded-md mb-4 shadow-md">
                      <img
                        src={album.imageUrl}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-white text-lg truncate">{album.title}</h3>
                    <p className="text-zinc-400 text-sm truncate">{album.artist}</p>
                    <p className="text-zinc-500 text-xs">{album.releaseYear}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Albums Section */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">All Albums</h2>
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <div key={item} className="bg-zinc-800 rounded-lg p-4 animate-pulse h-64"></div>
                ))}
              </div>
            ) : albums.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-8">
                {albums.map((album) => (
                  <Link
                    to={`/albums/${album._id}`}
                    key={album._id}
                    className='bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group relative'
                  >
                    <div className='relative mb-4'>
                      <div className='aspect-square rounded-md shadow-lg overflow-hidden'>
                        <img
                          src={album.imageUrl}
                          alt={album.title}
                          className='w-full h-full object-cover transition-transform duration-300 
                          group-hover:scale-105'
                        />
                      </div>
                    </div>
                    <h3 className='font-semibold text-white mb-1 truncate group-hover:text-green-400 transition-colors'>{album.title}</h3>
                    <p className='text-sm text-zinc-400 truncate'>{album.artist}</p>
                    <p className='text-xs text-zinc-500'>{album.releaseYear}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-zinc-400 text-center p-8 bg-zinc-800/30 rounded-lg">
                No albums found
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
      {showUpgradeModal && !isPro && <UpgradeModal setShowUpgradeModal={setShowUpgradeModal} />}
    </div>
  );
};

export default SpotifyAlbumsPage;