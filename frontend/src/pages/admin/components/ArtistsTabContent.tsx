import { useState } from "react";
import { useArtistStore } from "@/stores/useArtistStore";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { CreateArtistDialog } from "@/pages/admin/components/CreateArtistDialog";
import { useEffect } from "react";

export default function ArtistsTabContent() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { stats, fetchArtists, fetchArtistStats, deleteArtist } = useArtistStore();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    fetchArtists();
    fetchArtistStats();
  };

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
    loadData(); // Refresh data after creating
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Artists</h2>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Artist
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Bio</TableHead>
            <TableHead>Total Songs</TableHead>
            <TableHead>Total Albums</TableHead>
            <TableHead>Total Plays</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.map((artist) => (
            <TableRow key={artist._id}>
              <TableCell>
                <img
                  src={artist.imageUrl}
                  alt={artist.fullName}
                  className="size-10 object-cover rounded-full"
                />
              </TableCell>
              <TableCell>{artist.fullName}</TableCell>
              <TableCell className="max-w-xs truncate">{artist.bio}</TableCell>
              <TableCell>{artist.totalSongs}</TableCell>
              <TableCell>{artist.totalAlbums}</TableCell>
              <TableCell>{artist.totalPlays}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this artist?")) {
                      deleteArtist(artist._id);
                    }
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CreateArtistDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
