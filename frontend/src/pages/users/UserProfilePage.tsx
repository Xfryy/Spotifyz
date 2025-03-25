import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Play, Clock, Music } from "lucide-react";
import PlaylistCard from "./components/PlaylistCard";
import type { Playlist } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserProfile {
  _id: string;
  clerkId: string;
  fullName: string;
  imageUrl: string;
  isPro: boolean;
}

const UserProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("playlists");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userRes, playlistsRes] = await Promise.all([
          axiosInstance.get(`/users/byClerkId/${userId}`),
          axiosInstance.get(`/playlists/user/${userId}`)
        ]);
        
        setUser(userRes.data);
        setPlaylists(playlistsRes.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-spotify-green" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white">User not found</h2>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-80px)]">
      <ScrollArea className="h-full">
        <div className="min-h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
          {/* Header Section with Background Gradient */}
          <div className="bg-gradient-to-b from-spotify-green/30 to-zinc-900 pt-16 pb-8 px-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-40 h-40 rounded-full border-4 border-zinc-800 shadow-xl">
                <AvatarImage src={user.imageUrl} alt={user.fullName} />
                <AvatarFallback className="text-4xl bg-zinc-700">{user.fullName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {user.isPro && (
                    <span className="bg-spotify-green text-black text-xs px-2 py-1 rounded-full font-medium">
                      PRO
                    </span>
                  )}
                  <span className="text-xs text-zinc-400 uppercase font-semibold">Profile</span>
                </div>
                <h1 className="text-5xl font-bold text-white mb-2">{user.fullName}</h1>
                <div className="flex items-center gap-4 text-zinc-300">
                  <span className="flex items-center gap-1">
                    <Music className="h-4 w-4" />
                    {playlists.length} Playlists
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Joined {new Date().getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs and Content */}
          <div className="px-6 py-4">
            <div className="flex gap-6 border-b border-zinc-800 mb-6">
              <button
                className={`py-2 px-1 font-medium transition-colors ${
                  activeTab === "playlists" 
                    ? "text-white border-b-2 border-spotify-green" 
                    : "text-zinc-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("playlists")}
              >
                Playlists
              </button>
              <button
                className={`py-2 px-1 font-medium transition-colors ${
                  activeTab === "liked" 
                    ? "text-white border-b-2 border-spotify-green" 
                    : "text-zinc-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("liked")}
              >
                Liked Songs
              </button>
              <button
                className={`py-2 px-1 font-medium transition-colors ${
                  activeTab === "followers" 
                    ? "text-white border-b-2 border-spotify-green" 
                    : "text-zinc-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("followers")}
              >
                Followers
              </button>
            </div>

            {activeTab === "playlists" && (
              <>
                {/* Top Section with Popular Playlists */}
                {playlists.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Popular Playlists</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {playlists.slice(0, 2).map((playlist) => (
                        <div 
                          key={`popular-${playlist._id}`}
                          className="flex items-center gap-4 bg-zinc-800/60 p-4 rounded-lg hover:bg-zinc-700/60 transition-colors group"
                        >
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <img 
                              src={playlist.imageUrl} 
                              alt={playlist.title} 
                              className="w-full h-full object-cover rounded-md"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="bg-spotify-green rounded-full p-2 shadow-lg">
                                <Play className="h-4 w-4 text-black fill-current" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{playlist.title}</h3>
                            <div className="text-sm text-zinc-400">
                              {playlist.songs.length} songs • Created {new Date(playlist.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Playlists Grid */}
                <h2 className="text-xl font-bold text-white mb-4">All Playlists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {playlists.map((playlist) => (
                    <PlaylistCard
                      key={playlist._id}
                      id={playlist._id}
                      title={playlist.title}
                      image={playlist.imageUrl}
                      songCount={playlist.songs.length}
                      createdAt={playlist.createdAt}
                    />
                  ))}
                </div>

                {playlists.length === 0 && (
                  <div className="text-center py-12">
                    <Music className="w-16 h-16 mx-auto text-zinc-600 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No playlists yet</h3>
                    <p className="text-zinc-400">This user hasn't created any playlists</p>
                  </div>
                )}
              </>
            )}

            {activeTab === "liked" && (
              <div className="text-center py-12">
                <Music className="w-16 h-16 mx-auto text-zinc-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Liked Songs</h3>
                <p className="text-zinc-400">This feature is coming soon</p>
              </div>
            )}

            {activeTab === "followers" && (
              <div className="text-center py-12">
                <Music className="w-16 h-16 mx-auto text-zinc-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Followers</h3>
                <p className="text-zinc-400">This feature is coming soon</p>
              </div>
            )}
          </div>
          {/* Add bottom padding for audio player */}
          <div className="h-24" />
        </div>
      </ScrollArea>
    </div>
  );
};

export default UserProfilePage;