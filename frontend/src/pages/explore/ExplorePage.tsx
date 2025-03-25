import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { axiosInstance } from "@/lib/axios";
import { Playlist } from "@/types";
import { Users } from "lucide-react";
import Header from "@/components/Topbar";
import UpgradeModal from "@/components/UpgradeModal";
import { useAuthStore } from "@/stores/useAuthStore";

const ExplorePage = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { isPro } = useAuthStore();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axiosInstance.get("/playlists/public");
        setPlaylists(response.data);
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  // Get featured playlist (first playlist)
  const getFeaturedPlaylist = () => {
    if (!playlists || playlists.length === 0) return null;
    return playlists[0];
  };

  // Get top playlists (first 4 playlists)
  const getTopPlaylists = () => {
    if (!playlists || playlists.length === 0) return [];
    return playlists.slice(0, Math.min(4, playlists.length));
  };

  // Get recent playlists (arbitrary but we can sort differently)
  const getRecentPlaylists = () => {
    if (!playlists || playlists.length === 0) return [];
    // For demo purposes, take a different set of playlists
    return [...playlists]
      .sort((a, b) => a.title.localeCompare(b.title))
      .slice(0, 5);
  };

  const featuredPlaylist = getFeaturedPlaylist();
  const topPlaylists = getTopPlaylists();
  const recentPlaylists = getRecentPlaylists();

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
      <Header setShowUpgradeModal={setShowUpgradeModal} />
      <ScrollArea className="h-full">
        <div className="container px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <Users className="mr-3 size-7 text-green-400" />
              Community Playlists
            </h1>
            <p className="text-zinc-400">Discover playlists created by the Spotifyz community</p>
          </div>

          {/* Featured Playlist Section */}
          {!isLoading && featuredPlaylist && (
            <div className="mb-10">
              <div className="bg-gradient-to-r from-emerald-900/70 to-blue-900/60 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="aspect-square w-40 md:w-52 overflow-hidden rounded-md shadow-2xl">
                  <img 
                    src={featuredPlaylist.imageUrl} 
                    alt={featuredPlaylist.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-white font-bold">Featured Playlist</span>
                  <h2 className="text-4xl font-bold text-white my-2">{featuredPlaylist.title}</h2>
                  <p className="text-zinc-300 mb-4">By {featuredPlaylist.ownerName} • {featuredPlaylist.songs.length} songs</p>
                  <Link 
                    to={`/playlists/${featuredPlaylist._id}`}
                    className="bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-6 rounded-full w-fit transition-colors"
                  >
                    Listen Now
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Top Playlists Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">Top Playlists</h2>
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="bg-zinc-800 rounded-lg p-4 animate-pulse h-64"></div>
                ))}
              </div>
            ) : topPlaylists.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {topPlaylists.map((playlist) => (
                  <Link
                    to={`/playlists/${playlist._id}`}
                    key={playlist._id}
                    className="group bg-zinc-800/50 rounded-lg p-4 hover:bg-zinc-700/50 transition-all duration-300"
                  >
                    <div className="aspect-square overflow-hidden rounded-md mb-4 shadow-md">
                      <img
                        src={playlist.imageUrl}
                        alt={playlist.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-white text-lg">{playlist.title}</h3>
                    <p className="text-zinc-400 text-sm">By {playlist.ownerName}</p>
                    <p className="text-zinc-500 text-xs">{playlist.songs.length} songs</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-zinc-400 text-center p-8 bg-zinc-800/30 rounded-lg">
                No top playlists found
              </div>
            )}
          </div>

          {/* Recently Added Section */}
          {!isLoading && recentPlaylists.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-white mb-4">Recently Added</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {recentPlaylists.map((playlist) => (
                  <Link
                    to={`/playlists/${playlist._id}`}
                    key={`recent-${playlist._id}`}
                    className="group bg-zinc-800/50 rounded-lg p-4 hover:bg-zinc-700/50 transition-all duration-300"
                  >
                    <div className="aspect-square overflow-hidden rounded-md mb-4 shadow-md">
                      <img
                        src={playlist.imageUrl}
                        alt={playlist.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-white text-lg truncate">{playlist.title}</h3>
                    <p className="text-zinc-400 text-sm truncate">By {playlist.ownerName}</p>
                    <p className="text-zinc-500 text-xs">{playlist.songs.length} songs</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Playlists Section */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">All Playlists</h2>
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <div key={item} className="bg-zinc-800 rounded-lg p-4 animate-pulse h-64"></div>
                ))}
              </div>
            ) : playlists.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-8">
                {playlists.map((playlist) => (
                  <Link
                    to={`/playlists/${playlist._id}`}
                    key={playlist._id}
                    className='bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group relative'
                  >
                    <div className='relative mb-4'>
                      <div className='aspect-square rounded-md shadow-lg overflow-hidden'>
                        <img
                          src={playlist.imageUrl}
                          alt={playlist.title}
                          className='w-full h-full object-cover transition-transform duration-300 
                          group-hover:scale-105'
                        />
                      </div>
                    </div>
                    <h3 className='font-semibold text-white mb-1 truncate group-hover:text-green-400 transition-colors'>{playlist.title}</h3>
                    <p className='text-sm text-zinc-400 truncate'>By {playlist.ownerName}</p>
                    <p className='text-xs text-zinc-500'>{playlist.songs.length} songs</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-zinc-400 text-center p-8 bg-zinc-800/30 rounded-lg">
                No playlists found
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
      {showUpgradeModal && !isPro && <UpgradeModal setShowUpgradeModal={setShowUpgradeModal} />}
    </div>
  );
};

export default ExplorePage;