import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";

interface Artist {
  _id: string;
  fullName: string;
  imageUrl: string;
  bio: string;
  totalSongs?: number;
  totalAlbums?: number;
  totalPlays?: number;
}

interface ArtistStore {
  artists: Artist[];
  stats: Artist[];
  isLoading: boolean;
  error: string | null;
  fetchArtists: () => Promise<void>;
  fetchArtistStats: () => Promise<void>;
  createArtist: (formData: FormData) => Promise<void>;
  deleteArtist: (id: string) => Promise<void>;
}

export const useArtistStore = create<ArtistStore>((set) => ({
  artists: [],
  stats: [],
  isLoading: false,
  error: null,

  fetchArtists: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/admin/artists");
      set({ artists: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchArtistStats: async () => {
    try {
      const response = await axiosInstance.get("/admin/artists/stats");
      set({ stats: response.data });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  createArtist: async (formData: FormData) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post("/admin/artists", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      // Fetch both artists and stats after creation
      const [artistsResponse, statsResponse] = await Promise.all([
        axiosInstance.get("/admin/artists"),
        axiosInstance.get("/admin/artists/stats")
      ]);
      
      set({ 
        artists: artistsResponse.data,
        stats: statsResponse.data 
      });
    } catch (error: any) {
      set({ error: error.message });
      throw error; // Re-throw to handle in component
    } finally {
      set({ isLoading: false });
    }
  },

  deleteArtist: async (id: string) => {
    try {
      await axiosInstance.delete(`/admin/artists/${id}`);
      // Refresh data after successful deletion
      const [artistsResponse, statsResponse] = await Promise.all([
        axiosInstance.get("/admin/artists"),
        axiosInstance.get("/admin/artists/stats")
      ]);
      
      set({ 
        artists: artistsResponse.data,
        stats: statsResponse.data 
      });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));
