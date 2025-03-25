import { useEffect, useState, useRef } from "react";
import Topbar from "@/components/Topbar";
import { useSearchStore } from "@/stores/useSearchStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import UpgradeModal from "@/components/UpgradeModal"; 
import { useAuthStore } from "@/stores/useAuthStore";


import SearchHeader from "./components/SearchHeader";
import BackgroundStars from "./components/BackgroundStars";
import MagicParticles from "./components/MagicParticles";
import TopResult from "./components/TopResult";
import AlbumGrid from "./components/AlbumGrid";
import PlaylistGrid from "./components/PlaylistGrid";
import FeaturedSongs from "./components/FeaturedSongs";
import NoResults from "./components/NoResults";
import EnchantedStyles from "./components/EnchantedStyles";
import SongList from "./components/SongResults";

const SearchPage = () => {
  const { query, setQuery, searchContent, results, isSearching } = useSearchStore();
  const { featuredSongs } = useMusicStore();
  const { setCurrentSong, playAlbum } = usePlayerStore();
  const { user } = useUser();
  const { isPro } = useAuthStore();
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isEnchanted, setIsEnchanted] = useState(false);
  const [sparklePosition, setSparklePosition] = useState({ x: 0, y: 0 });
  const [showParticles, setShowParticles] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const hasResults = query.trim() !== "" && 
    (results.songs.length > 0 || results.albums.length > 0 || results.playlists.length > 0) && 
    !isSearching;
  
  // Focus search input when page loads
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    
    // Activate enchantment effect after a short delay
    const timer = setTimeout(() => {
      setIsEnchanted(true);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);

  // Update debounced query after 300ms of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      if (query.trim() !== '') {
        // Show magic particles when searching
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 1500);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [query]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim() !== "") {
      searchContent(debouncedQuery);
    }
  }, [debouncedQuery, searchContent]);
  
  // Handler for playing the top result
  const handlePlayTopResult = () => {
    if (!user) {
      toast.error("Please log in to play songs", {
        icon: '🎵',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }
    if (results.songs.length > 0) {
      setCurrentSong(results.songs[0]);
      // Show sparkle effect on play
      const randomX = Math.random() * window.innerWidth;
      const randomY = Math.random() * 200;
      setSparklePosition({ x: randomX, y: randomY });
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 1500);
    }
  };
  
  // Handler for playing all search results
  const handlePlayAllResults = (startIndex = 0) => {
    if (!user) {
      toast.error("Please log in to play songs", {
        icon: '🎵',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }
    if (results.songs.length > 0) {
      playAlbum(results.songs, startIndex);
      // Show sparkle effect on play
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 1500);
    }
  };

  return (
    <main className="h-full flex flex-col bg-gradient-to-b from-zinc-900 via-purple-900/20 to-zinc-900 relative overflow-hidden">
      <BackgroundStars />
      <Topbar setShowUpgradeModal={setShowUpgradeModal} />
      
      <SearchHeader 
        query={query}
        setQuery={setQuery}
        hasResults={hasResults}
        isEnchanted={isEnchanted}
      />
      
      <MagicParticles show={showParticles} position={sparklePosition} />

      <div className={`flex-1 px-4 sm:px-6 overflow-hidden ${hasResults ? 'pt-4' : ''}`}>
        <ScrollArea className="h-full">
          <div className="py-6">
            {query.trim() !== "" && !isSearching && hasResults && (
              <TopResult song={results.songs[0]} onPlay={handlePlayTopResult} />
            )}

            {query.trim() !== "" && results.songs.length > 0 && (
              <SongList 
                songs={results.songs} 
                isLoading={isSearching} 
                onPlaySong={(index) => handlePlayAllResults(index)}
              />
            )}

            <AlbumGrid albums={results.albums} />
            <PlaylistGrid playlists={results.playlists} />

            {query.trim() !== "" && !hasResults && !isSearching && (
              <NoResults query={query} />
            )}
            
            {query.trim() === "" && (
              <FeaturedSongs songs={featuredSongs} />
            )}
          </div>
        </ScrollArea>
      </div>

      <EnchantedStyles />
      {showUpgradeModal && !isPro && <UpgradeModal setShowUpgradeModal={setShowUpgradeModal} />}
    </main>
  );
};

export default SearchPage;
