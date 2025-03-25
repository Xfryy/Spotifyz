import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats, PeriodStats } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface MusicStore {
	songs: Song[];
	albums: Album[];
	isLoading: boolean;
	error: string | null;
	currentAlbum: Album | null;
	featuredSongs: Song[];
	madeForYouSongs: Song[];
	trendingSongs: Song[];
	stats: Stats;
	songStats: any[]; // each item: { _id, title, artist, plays }
	randomAlbums: Album[];
	fetchAlbums: () => Promise<void>;
	fetchAlbumById: (id: string) => Promise<void>;
	fetchFeaturedSongs: () => Promise<void>;
	fetchMadeForYouSongs: () => Promise<void>;
	fetchTrendingSongs: () => Promise<void>;
	fetchStats: () => Promise<void>;
	fetchSongs: () => Promise<void>;
	deleteSong: (id: string) => Promise<void>;
	deleteAlbum: (id: string) => Promise<void>;
	fetchSongStats: () => Promise<void>;
	fetchRandomAlbums: () => Promise<void>;
	fetchSongPeriodStats: (songId: string, period: string) => Promise<void>;
	currentSongPeriodStats: PeriodStats | null;
	likedSongs: Song[];
	toggleLikeSong: (song: Song) => void;
	isLiked: (songId: string) => boolean;
}

export const useMusicStore = create<MusicStore>((set, get) => ({
	albums: [],
	songs: [],
	isLoading: false,
	error: null,
	currentAlbum: null,
	madeForYouSongs: [],
	featuredSongs: [],
	trendingSongs: [],
	stats: {
		totalSongs: 0,
		totalAlbums: 0,
		totalUsers: 0,
		totalArtists: 0,
	},
	songStats: [],
	randomAlbums: [],
	currentSongPeriodStats: null,
	likedSongs: JSON.parse(localStorage.getItem('likedSongs') || '[]'),

	deleteSong: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/songs/${id}`);
			// Refresh all related data
			await Promise.all([
				useMusicStore.getState().fetchSongs(),
				useMusicStore.getState().fetchStats(),
				useMusicStore.getState().fetchSongStats()
			]);
			toast.success("Song deleted successfully");
		} catch (error: any) {
			console.log("Error in deleteSong", error);
			toast.error("Error deleting song");
		} finally {
			set({ isLoading: false });
		}
	},

	deleteAlbum: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/albums/${id}`);
			// Refresh all related data
			await Promise.all([
				useMusicStore.getState().fetchAlbums(),
				useMusicStore.getState().fetchSongs(),
				useMusicStore.getState().fetchStats()
			]);
			toast.success("Album deleted successfully");
		} catch (error: any) {
			toast.error("Failed to delete album: " + error.message);
		} finally {
			set({ isLoading: false });
		}
	},

	fetchSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs");
			set({ songs: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchStats: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/stats");
			set({ stats: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbums: async () => {
		set({ isLoading: true, error: null });

		try {
			const response = await axiosInstance.get("/albums");
			set({ albums: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbumById: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/albums/${id}`);
			set({ currentAlbum: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchFeaturedSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/featured");
			set({ featuredSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchMadeForYouSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/made-for-you");
			set({ madeForYouSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchTrendingSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/trending");
			set({ trendingSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchSongStats: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/admin/songs/stats");
			set({ songStats: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchRandomAlbums: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/albums");
			const albums = response.data;
			// Get 10 random albums
			const randomAlbums = albums.sort(() => Math.random() - 0.5).slice(0, 10);
			set((state) => ({ ...state, randomAlbums }));
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchSongPeriodStats: async (songId, period) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/stats/song-plays?songId=${songId}&period=${period}`);
			set({ currentSongPeriodStats: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	toggleLikeSong: (song) => {
		set((state) => {
			const isLiked = state.likedSongs.some(s => s._id === song._id);
			const newLikedSongs = isLiked
				? state.likedSongs.filter(s => s._id !== song._id)
				: [...state.likedSongs, song];
			
			localStorage.setItem('likedSongs', JSON.stringify(newLikedSongs));
			return { likedSongs: newLikedSongs };
		});
	},

	isLiked: (songId) => {
		return get().likedSongs.some(song => song._id === songId);
	},
}));
