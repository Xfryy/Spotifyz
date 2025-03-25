// AddSongToPlaylistDialog.tsx - Enhanced Spotify-like styling
import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { Button } from "@/components/ui/button";

interface AddSongToPlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string;
  existingSongs: string[];
}

const AddSongToPlaylistDialog = ({
  isOpen,
  onClose,
  playlistId,
  existingSongs,
}: AddSongToPlaylistDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { songs } = useMusicStore();
  const { addSongToPlaylist, fetchPlaylistById } = usePlaylistStore();
  const [isAdding, setIsAdding] = useState<string | null>(null);

  // Use effect to fetch songs if needed
  useEffect(() => {
    if (isOpen) {
      // Optional: Refresh songs list when dialog opens
      useMusicStore.getState().fetchSongs();
    }
  }, [isOpen]);

  const filteredSongs = useMemo(() => {
    return songs.filter(song => 
      (song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !existingSongs.includes(song._id)
    );
  }, [songs, searchQuery, existingSongs]);

  const handleAddSong = async (songId: string) => {
    try {
      setIsAdding(songId);
      await addSongToPlaylist(playlistId, songId);
      // Refresh playlist data
      await fetchPlaylistById(playlistId);
      setIsAdding(null);
    } catch (error) {
      console.error("Failed to add song:", error);
      setIsAdding(null);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setIsAdding(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Add to your playlist</DialogTitle>
        </DialogHeader>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search for songs"
            className="pl-10 bg-zinc-800 border-none focus:ring-1 focus:ring-green-500 py-6 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        {filteredSongs.length > 0 && (
          <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center text-sm text-zinc-400 px-2 pb-2 border-b border-zinc-800">
            <div>#</div>
            <div>TITLE</div>
            <div></div>
          </div>
        )}

        <div className="space-y-2 max-h-[450px] overflow-y-auto custom-scrollbar">
          {filteredSongs.length === 0 ? (
            <div className="text-center py-10 text-zinc-400">
              {searchQuery ? "No songs found matching your search" : "No songs available to add"}
            </div>
          ) : (
            filteredSongs.map((song, index) => (
              <div
                key={song._id}
                className="grid grid-cols-[auto_1fr_auto] gap-4 p-2 hover:bg-zinc-800/80 rounded-md group items-center"
              >
                <div className="font-medium text-zinc-400 w-6 text-center">
                  {index + 1}
                </div>
                <div className="flex items-center gap-3">
                  <img 
                    src={song.imageUrl} 
                    alt={song.title} 
                    className="w-10 h-10 rounded shadow-md"
                  />
                  <div>
                    <div className="font-medium text-white">{song.title}</div>
                    <div className="text-sm text-zinc-400">{song.artist}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  disabled={isAdding === song._id}
                  className={`
                    rounded-full px-4 font-medium 
                    ${isAdding === song._id ? 'bg-green-500/20 text-green-400' : 'bg-transparent text-white hover:bg-green-500 hover:text-black'} 
                    transition-all
                  `}
                  onClick={() => handleAddSong(song._id)}
                >
                  {isAdding === song._id ? 'Adding...' : 'Add'}
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSongToPlaylistDialog;