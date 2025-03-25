import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "@/components/Topbar";
import { useUser } from "@clerk/clerk-react";
import AddSongToPlaylistDialog from "@/pages/Playlists/components/AddSongToPlaylistDialog";
import UpgradeModal from "@/components/UpgradeModal";
import PlaylistHeader from "./PlaylistDetailHeader";
import PlaylistControls from "./PlaylistControls";
import SongsTable from "./SongsTable";
import ColorThief from "colorthief";

const PlaylistDetailPage = () => {
  const { playlistId } = useParams();
  const { currentPlaylist, fetchPlaylistById, deletePlaylist, removeSongFromPlaylist } = usePlaylistStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { user } = useUser();
  const [showAddSongDialog, setShowAddSongDialog] = useState(false);
  const isOwner = user?.id === currentPlaylist?.owner;
  const [backgroundGradient, setBackgroundGradient] = useState<string>("");

  useEffect(() => {
    if (playlistId) {
      fetchPlaylistById(playlistId);
    }
  }, [playlistId, fetchPlaylistById]);

  useEffect(() => {
    if (playlistId) {
      fetchPlaylistById(playlistId);
    }
  }, [playlistId, showAddSongDialog]);

  useEffect(() => {
    if (currentPlaylist?.imageUrl) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = currentPlaylist.imageUrl;

      img.onload = () => {
        const colorThief = new ColorThief();
        try {
          const dominantColor = colorThief.getColor(img);
          // More Spotify-like gradient with higher opacity and longer fade
          const gradient = `linear-gradient(180deg, rgba(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]}, 0.8) 0%, rgba(18, 18, 18, 1) 100%)`;
          setBackgroundGradient(gradient);
        } catch (error) {
          console.error("Error extracting color:", error);
          setBackgroundGradient("linear-gradient(180deg, rgba(40, 40, 40, 0.8) 0%, rgba(18, 18, 18, 1) 100%)");
        }
      };

      img.onerror = () => {
        setBackgroundGradient("linear-gradient(180deg, rgba(40, 40, 40, 0.8) 0%, rgba(18, 18, 18, 1) 100%)");
      };
    }
  }, [currentPlaylist?.imageUrl]);

  const isCurrentlyPlaying = currentPlaylist?.songs.some(
    (song) => song._id === currentSong?._id
  ) ?? false;

  const handlePlay = () => {
    if (currentPlaylist) {
      if (isCurrentlyPlaying) {
        togglePlay();
      } else {
        playAlbum(currentPlaylist.songs);
      }
    }
  };

  const handleDeletePlaylist = async () => {
    if (playlistId) {
      await deletePlaylist(playlistId);
      window.location.href = "/playlists";
    }
  };

  const handleRemoveSong = async (songId: string) => {
    if (playlistId) {
      await removeSongFromPlaylist(playlistId, songId);
      fetchPlaylistById(playlistId);
    }
  };

  const handleCloseAddSongDialog = () => {
    setShowAddSongDialog(false);
    // Only fetch if we were showing the dialog
    if (showAddSongDialog && playlistId) {
      setTimeout(() => {
        fetchPlaylistById(playlistId);
      }, 100);
    }
  };

  if (!currentPlaylist) {
    return (
      <div className="flex items-center justify-center h-full text-center p-8 text-zinc-400 bg-zinc-900">
        <div className="animate-pulse">Loading playlist...</div>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-80px)]"> {/* Add fixed height */}
      <Header setShowUpgradeModal={setShowUpgradeModal} />
      <ScrollArea className="h-full">
        <div className="min-h-full">
          {/* The background is now set directly in each component with proper gradients */}
          <PlaylistHeader
            imageUrl={currentPlaylist.imageUrl}
            title={currentPlaylist.title}
            ownerName={currentPlaylist.ownerName}
            ownerId={currentPlaylist.owner}
            songCount={currentPlaylist.songs.length}
            totalDuration={currentPlaylist.songs.reduce((acc, song) => acc + (song.duration || 0), 0)}
            backgroundGradient={backgroundGradient}
          />
          <PlaylistControls
            isOwner={isOwner}
            isSongCurrentlyPlaying={isCurrentlyPlaying || false}
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onAddSong={(e) => {
              e.stopPropagation();
              setShowAddSongDialog(true);
            }}
            onDeletePlaylist={handleDeletePlaylist}
          />
          <SongsTable
            songs={currentPlaylist.songs}
            currentSongId={currentSong?._id}
            isPlaying={isPlaying}
            isOwner={isOwner}
            onPlaySong={(index) => playAlbum(currentPlaylist.songs, index)}
            onRemoveSong={handleRemoveSong}
          />
          {/* Add bottom padding for better scrolling experience */}
          <div className="h-24" />
        </div>
      </ScrollArea>
      
      {isOwner && showAddSongDialog && ( // Only render when needed
        <AddSongToPlaylistDialog
          isOpen={showAddSongDialog}
          onClose={handleCloseAddSongDialog}
          playlistId={playlistId!}
          existingSongs={currentPlaylist?.songs.map((song) => song._id) || []}
        />
      )}

      {showUpgradeModal && <UpgradeModal setShowUpgradeModal={setShowUpgradeModal} />}
    </div>
  );
};

export default PlaylistDetailPage;
