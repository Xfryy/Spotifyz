import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  clerkId: string;
  fullName: string;
  imageUrl: string;
  isPro: boolean;
  createdAt: string;
  emailAddresses: { emailAddress: string }[];
  firstName: string;
  lastName: string;
}

interface AuthStore {
  user: User | null;
	isAdmin: boolean;
	isPro: boolean;
	isLoading: boolean;
	error: string | null;

	handleAuthCallback: (userData: any) => Promise<void>;
	checkAdminStatus: () => Promise<void>;
	checkProStatus: () => Promise<boolean>;
	setProStatus: (status: boolean) => void;
	reset: () => void;
}

export const useAuthStore = create<AuthStore>()(
	persist(
		(set, get) => ({
			user: null,
			isAdmin: false,
			isPro: false,
			isLoading: false,
			error: null,

			handleAuthCallback: async (userData) => {
				set({ isLoading: true, error: null });
				try {
					const response = await axiosInstance.post("/auth/callback", userData);
					const { user } = response.data;
					set({ 
						user,
						isPro: user.isPro 
					});
				} catch (error: any) {
					set({ error: error.response?.data?.message || "Authentication failed" });
				} finally {
					set({ isLoading: false });
				}
			},

			checkAdminStatus: async () => {
				set({ isLoading: true, error: null });
				try {
					const response = await axiosInstance.get("/admin/check");
					set({ isAdmin: response.data.admin });
				} catch (error: any) {
					set({ isAdmin: false, error: error.response.data.message });
				} finally {
					set({ isLoading: false });
				}
			},

			checkProStatus: async () => {
				try {
					const response = await axiosInstance.get("/payment/check-pro");
					const isProStatus = response.data.isPro;
					set({ isPro: isProStatus });
					return isProStatus;
				} catch (error) {
					console.error("Failed to verify pro status:", error);
					return false;
				}
			},

			setProStatus: (status) => {
				set({ isPro: status });
				if (get().user) {
					set((state) => ({
						user: state.user ? { ...state.user, isPro: status } : null
					}));
				}
			},

			reset: () => {
				set({ 
					user: null,
					isAdmin: false,
					isPro: false,
					isLoading: false, 
					error: null 
				});
			},
		}),
		{
			name: 'auth-storage',
			partialize: (state) => ({ 
				user: state.user,
				isPro: state.isPro,
				isAdmin: state.isAdmin
			})
		}
	)
);
