import { useAuthStore } from "@/stores/useAuthStore";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import { Album, Music, BarChart3, Mic2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongsTabContent from "./components/SongsTabContent";
import AlbumsTabContent from "./components/AlbumsTabContent";
import SongStatsTabContent from "./components/SongStatsTabContent";
import ArtistsTabContent from "./components/ArtistsTabContent";
import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";

const AdminPage = () => {
  const { isAdmin, isLoading } = useAuthStore();
  const { fetchAlbums, fetchSongs, fetchStats, fetchSongStats } = useMusicStore();

  useEffect(() => {
    fetchAlbums();
    fetchSongs();
    fetchStats();
    fetchSongStats();
  }, [fetchAlbums, fetchSongs, fetchStats, fetchSongStats]);

  if (!isAdmin && !isLoading) return <div>Unauthorized</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 p-8">
      <Header />
      <DashboardStats />
      <Tabs defaultValue="songs" className="space-y-6">
        <TabsList className="p-1 bg-zinc-800/50">
          <TabsTrigger value="songs" className="data-[state=active]:bg-zinc-700">
            <Music className="mr-2 size-4" />
            Songs
          </TabsTrigger>
          <TabsTrigger value="albums" className="data-[state=active]:bg-zinc-700">
            <Album className="mr-2 size-4" />
            Albums
          </TabsTrigger>
          <TabsTrigger value="artists" className="data-[state=active]:bg-zinc-700">
            <Mic2 className="mr-2 size-4" />
            Artists
          </TabsTrigger>
          <TabsTrigger value="stats" className="data-[state=active]:bg-zinc-700">
            <BarChart3 className="mr-2 size-4" />
            Song Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="songs">
          <SongsTabContent />
        </TabsContent>
        <TabsContent value="albums">
          <AlbumsTabContent />
        </TabsContent>
        <TabsContent value="stats">
          <SongStatsTabContent />
        </TabsContent>
        <TabsContent value="artists">
          <ArtistsTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;