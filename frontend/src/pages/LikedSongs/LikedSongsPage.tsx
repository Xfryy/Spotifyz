import { useMusicStore } from "@/stores/useMusicStore";
import SongsTable from "../Playlists/PlaylistDetailPage/SongsTable";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Heart, Play, Pause, Download, Share2, MoreHorizontal } from "lucide-react";
import Header from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";

// Helper function for formatting duration 
const formatDuration = (seconds: number) => {
    // Handle invalid or missing duration
    if (!seconds || isNaN(seconds)) return "0:00";
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// Improved total duration calculation with error handling
const calculateTotalDuration = (songs: any[]) => {
    // Validate input and handle empty array
    if (!songs || songs.length === 0) return "0 hr 0 min";

    // Safely sum durations, filtering out invalid values
    const totalSeconds = songs.reduce((acc, song) => {
        // Only add valid, numeric durations
        const duration = song.duration && !isNaN(song.duration) ? song.duration : 0;
        return acc + duration;
    }, 0);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours} hr ${minutes} min`;
};

const LikedSongs = () => {
    const { likedSongs } = useMusicStore();
    const { currentSong, isPlaying, setCurrentSong, togglePlay, playAlbum } = usePlayerStore();
    const { user } = useUser();

    const handlePlaySong = (index: number) => {
        // Additional null/empty check
        if (!user) {
            toast.error("Please log in to play songs");
            return;
        }
        
        if (!likedSongs || likedSongs.length === 0) {
            toast.error("No songs to play");
            return;
        }

        if (currentSong?._id === likedSongs[index]._id) {
            togglePlay();
        } else {
            playAlbum(likedSongs, index);
        }
    };

    const handlePlayAllLikedSongs = () => {
        if (!user) {
            toast.error("Please log in to play songs");
            return;
        }

        if (!likedSongs || likedSongs.length === 0) {
            toast.error("No songs to play");
            return;
        }

        const isCurrentlyPlayingLikedSongs = likedSongs.some(song => song._id === currentSong?._id);
        
        if (isCurrentlyPlayingLikedSongs) {
            togglePlay();
        } else {
            playAlbum(likedSongs, 0);
        }
    };

    const handleRemoveSong = (songId: string) => {
        const song = likedSongs.find(s => s._id === songId);
        if (song) {
            useMusicStore.getState().toggleLikeSong(song);
        }
    };

    const isCurrentlyPlayingLikedSongs = likedSongs.some(song => song._id === currentSong?._id);

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900/70 to-zinc-900/90">
            <Header setShowUpgradeModal={() => {}} />
            
            <div className="px-6 pt-20">
                {/* Playlist Header */}
                <div className="flex items-end gap-6 mb-8">
                    <div 
                        className="w-56 h-56 bg-gradient-to-br from-purple-700 to-blue-400 
                        flex items-center justify-center shadow-2xl"
                    >
                        <Heart className="w-24 h-24 text-white" />
                    </div>
                    
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Playlist</h4>
                        <h1 className="text-8xl font-black text-white mb-4">Liked Songs</h1>
                        
                        <div className="flex items-center gap-2 text-zinc-300">
                            <span>{likedSongs?.length || 0} songs</span>
                            <span className="mx-2">•</span>
                            <span>{calculateTotalDuration(likedSongs)}</span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6 mb-6">
                    <Button
                        onClick={handlePlayAllLikedSongs}
                        size="icon"
                        className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-400 
                        hover:scale-105 transition-all shadow-xl flex items-center justify-center"
                    >
                        {isCurrentlyPlayingLikedSongs && isPlaying ? (
                            <Pause className="h-8 w-8 text-black" />
                        ) : (
                            <Play className="h-8 w-8 text-black ml-1" />
                        )}
                    </Button>

                    <div className="flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-zinc-400 hover:text-white"
                        >
                            <Download className="h-6 w-6" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-zinc-400 hover:text-white"
                        >
                            <Share2 className="h-6 w-6" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-zinc-400 hover:text-white"
                        >
                            <MoreHorizontal className="h-6 w-6" />
                        </Button>
                    </div>
                </div>

                {/* Songs Table */}
                <SongsTable
                    songs={likedSongs || []}
                    currentSongId={currentSong?._id}
                    isPlaying={isPlaying}
                    isOwner={true}
                    onPlaySong={handlePlaySong}
                    onRemoveSong={handleRemoveSong}
                    formatDuration={formatDuration}
                    showCreatedDate={true}
                />
            </div>
        </div>
    );
};

export default LikedSongs;