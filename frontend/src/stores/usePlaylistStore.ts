import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { Playlist } from "@/types";
import toast from "react-hot-toast";

interface PlaylistStore {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  isLoading: boolean;
  
  fetchPlaylists: () => Promise<void>;
  createPlaylist: (data: FormData) => Promise<void>;
  updatePlaylist: (id: string, data: FormData) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
  fetchPlaylistById: (id: string) => Promise<void>;
}

export const usePlaylistStore = create<PlaylistStore>((set, get) => ({
  playlists: [],
  currentPlaylist: null,
  isLoading: false,

  fetchPlaylists: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/playlists/me");
      set({ playlists: response.data });
    } catch (error: any) {
      if (error && error.response?.status !== 401) {
        toast.error("Failed to fetch playlists");
      }
      set({ playlists: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  createPlaylist: async (data) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/playlists", data);
      set(state => ({ 
        playlists: [response.data, ...state.playlists] 
      }));
      toast.success("Playlist created!");
    } catch {
      toast.error("Failed to create playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  updatePlaylist: async (id, data) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.patch(`/playlists/${id}`, data);
      set(state => ({
        playlists: state.playlists.map(p => 
          p._id === id ? response.data : p
        )
      }));
      toast.success("Playlist updated!");
    } catch {
      toast.error("Failed to update playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlaylist: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/playlists/${id}`);
      set(state => ({
        playlists: state.playlists.filter(p => p._id !== id)
      }));
      toast.success("Playlist deleted!");
    } catch {
      toast.error("Failed to delete playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  addSongToPlaylist: async (playlistId, songId) => {
    try {
      const response = await axiosInstance.post(
        `/playlists/${playlistId}/songs`, 
        { songId }
      );

      // Update both playlists array and currentPlaylist
      set(state => ({
        playlists: state.playlists.map(p =>
          p._id === playlistId ? response.data : p
        ),
        currentPlaylist: state.currentPlaylist?._id === playlistId 
          ? response.data 
          : state.currentPlaylist
      }));

      // Refetch the playlist to ensure we have the latest data
      await get().fetchPlaylistById(playlistId);
      
      toast.success("Song added to playlist!");
    } catch {
      toast.error("Failed to add song to playlist");
    }
  },

  removeSongFromPlaylist: async (playlistId, songId) => {
    try {
      const response = await axiosInstance.delete(
        `/playlists/${playlistId}/songs/${songId}`
      );
      set(state => ({
        playlists: state.playlists.map(p =>
          p._id === playlistId ? response.data : p
        )
      }));
      toast.success("Song removed from playlist!");
    } catch {
      toast.error("Failed to remove song from playlist");
    }
  },

  fetchPlaylistById: async (id) => {
    try {
      const response = await axiosInstance.get(`/playlists/${id}`);
      set({ currentPlaylist: response.data });
    } catch {
      toast.error("Failed to fetch playlist");
    }
  },
}));
