import { useMusicStore } from "@/stores/useMusicStore";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { useEffect, useState } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";
import UpgradeModal from "@/components/UpgradeModal";
import { useAuthStore } from "@/stores/useAuthStore";
import Header from "@/components/Topbar";
import { AdvertisementSlider } from "./components/AdvertisementSlider";
import HuTaoMusicBanner from "./components/HuTaoMusicBanner";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import { Sparkles, Clock, Calendar, Disc3 } from "lucide-react";

const HomePage = () => {
  const {
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    fetchRandomAlbums,
    isLoading,
    madeForYouSongs,
    featuredSongs,
    trendingSongs,
    randomAlbums,
  } = useMusicStore();

  const { playlists, fetchPlaylists } = usePlaylistStore();
  const { initializeQueue } = usePlayerStore();
  const { isPro } = useAuthStore();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { user } = useUser();
  const [publicPlaylists, setPublicPlaylists] = useState([]);
  const [greeting, setGreeting] = useState("Good morning");
  
  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good morning");
    else if (hour >= 12 && hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
    
    // Fetch user playlists if needed
    if (user) {
      fetchPlaylists();
    }
  }, [user, fetchPlaylists]);

  useEffect(() => {
    const fetchPublicPlaylists = async () => {
      try {
        const response = await axiosInstance.get("/playlists/public");
        setPublicPlaylists(response.data);
      } catch (error) {
        console.error("Failed to fetch public playlists:", error);
      }
    };

    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
    fetchRandomAlbums();
    fetchPublicPlaylists();
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs, fetchRandomAlbums]);

  useEffect(() => {
    if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
      const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
      initializeQueue(allSongs);
    }
  }, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

  interface CollectionItem {
    _id: string;
    imageUrl: string;
    title: string;
    artist?: string;
    ownerName?: string;
    songs?: any[];
  }

  // Function to render collection items (albums, playlists) in a grid
  const renderCollectionGrid = (
    items: CollectionItem[],
    title: string,
    linkPath: string,
    type: string = "playlist",
    icon: React.ReactNode = null
  ) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
          <Link to={linkPath} className="text-sm text-zinc-400 hover:text-white transition-colors">
            Show all
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {items.slice(0, 5).map((item) => (
            <Link
              key={item._id}
              to={`/${type}s/${item._id}`}
              className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group relative"
            >
              <div className="relative mb-4">
                <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 
                    group-hover:scale-105"
                  />
                </div>
                {/* Play button overlay */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                  <button className="bg-green-500 hover:bg-green-400 text-black p-3 rounded-full shadow-lg">
                    <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                    </svg>
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-white mb-1 truncate group-hover:text-green-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-zinc-400 truncate">
                {type === "album" ? `By ${item.artist}` : `By ${item.ownerName || "Unknown"}`}
              </p>
              <p className="text-xs text-zinc-500">
                {(item.songs?.length || 0)} songs
              </p>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  // Quick links section
  const QuickLinks = () => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <Link to="/library" className="bg-gradient-to-br from-emerald-800 to-green-900 p-4 rounded-lg shadow-md hover:shadow-lg transition-all hover:brightness-110">
        <div className="flex items-center mb-2">
          <Clock className="h-5 w-5 mr-2 text-emerald-300" />
          <h3 className="font-semibold">Recently Played</h3>
        </div>
        <p className="text-xs text-zinc-300">Access your listening history</p>
      </Link>
      <Link to="/liked" className="bg-gradient-to-br from-purple-800 to-indigo-900 p-4 rounded-lg shadow-md hover:shadow-lg transition-all hover:brightness-110">
        <div className="flex items-center mb-2">
          <Sparkles className="h-5 w-5 mr-2 text-purple-300" />
          <h3 className="font-semibold">Liked Songs</h3>
        </div>
        <p className="text-xs text-zinc-300">Your favorite tracks in one place</p>
      </Link>
      <Link to="/new-releases" className="bg-gradient-to-br from-amber-700 to-orange-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-all hover:brightness-110">
        <div className="flex items-center mb-2">
          <Calendar className="h-5 w-5 mr-2 text-amber-300" />
          <h3 className="font-semibold">New Releases</h3>
        </div>
        <p className="text-xs text-zinc-300">Fresh tracks just for you</p>
      </Link>
      <Link to="/explore" className="bg-gradient-to-br from-blue-800 to-cyan-900 p-4 rounded-lg shadow-md hover:shadow-lg transition-all hover:brightness-110">
        <div className="flex items-center mb-2">
          <Disc3 className="h-5 w-5 mr-2 text-blue-300" />
          <h3 className="font-semibold">Explore</h3>
        </div>
        <p className="text-xs text-zinc-300">Discover new music and genres</p>
      </Link>
    </div>
  );

  return (
    <>
      <Header setShowUpgradeModal={setShowUpgradeModal} />
      <main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900'>
        <ScrollArea className='h-[calc(100vh-180px)]'>
          <div className='p-4 sm:p-6'>
            <AdvertisementSlider />

            <h1 className='text-2xl sm:text-3xl font-bold mb-6 mt-8'>
              {greeting}, <span className="text-green-400">{user?.firstName || "Guest"}</span>
            </h1>
            
            {/* Quick links section */}
            <QuickLinks />
            
            <FeaturedSection />
            <HuTaoMusicBanner />
            
            <div className='space-y-8 mt-8'>
              {/* Your Playlists Section */}
              {playlists?.length > 0 && renderCollectionGrid(
                playlists, 
                "Your Playlists", 
                "/playlists", 
                "playlist", 
                <Sparkles className="h-5 w-5 text-green-400" />
              )}
              
              {/* Made For You Section */}
              <SectionGrid title='Made For You' songs={madeForYouSongs} isLoading={isLoading} />
              
              {/* Albums Section */}
              {randomAlbums?.length > 0 && renderCollectionGrid(
                randomAlbums, 
                "Albums for you", 
                "/albums", 
                "album",
                <Disc3 className="h-5 w-5 text-purple-400" />
              )}
              
              {/* Trending Section */}
              <SectionGrid title='Trending' songs={trendingSongs} isLoading={isLoading} />
              
              {/* Public Playlists Section */}
              {publicPlaylists?.length > 0 && renderCollectionGrid(
                publicPlaylists, 
                "Public Playlists", 
                "/explore", 
                "playlist"
              )}
            </div>
            
            {/* Footer section */}
            <div className="mt-16 mb-8 border-t border-zinc-700 pt-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                <div>
                  <h4 className="font-semibold mb-3">Company</h4>
                  <ul className="space-y-2 text-sm text-zinc-400">
                    <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Jobs</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">For the Record</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Communities</h4>
                  <ul className="space-y-2 text-sm text-zinc-400">
                    <li><a href="#" className="hover:text-white transition-colors">For Artists</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Developers</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Advertising</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Useful Links</h4>
                  <ul className="space-y-2 text-sm text-zinc-400">
                    <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Web Player</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Social</h4>
                  <div className="flex gap-4 text-zinc-400">
                    <a href="#" className="hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                    </a>
                    <a href="#" className="hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                    </a>
                    <a href="#" className="hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
                    </a>
                  </div>
                  <p className="mt-4 text-xs text-zinc-500">© 2025 Spotifyz</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        {showUpgradeModal && !isPro && <UpgradeModal setShowUpgradeModal={setShowUpgradeModal} />}
      </main>
    </>
  );
};

export default HomePage;
