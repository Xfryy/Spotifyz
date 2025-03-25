import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { Song, Album, Playlist } from "../types";

interface SearchState {
  query: string;
  results: {
    songs: Song[];
    albums: Album[];
    playlists: Playlist[];
  };
  isSearching: boolean;
  error: string | null;
  setQuery: (query: string) => void;
  searchContent: (query: string) => Promise<void>;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  results: {
    songs: [],
    albums: [],
    playlists: []
  },
  isSearching: false,
  error: null,
  setQuery: (query) => set({ query }),
  searchContent: async (query) => {
    try {
      set({ isSearching: true, error: null });
      
      const response = await axiosInstance.get(`/songs/search?query=${encodeURIComponent(query)}`);
      
      // Tambahkan default values jika response.data tidak lengkap
      set({ 
        results: {
          songs: response.data.songs || [],
          albums: response.data.albums || [],
          playlists: response.data.playlists || [],
        },
        isSearching: false 
      });
    } catch (error) {
      console.error('Search error:', error); // Untuk debugging
      set({
      });
    }
  }
}));