import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth, useUser } from "@clerk/clerk-react"; // Add useUser import
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const updateApiToken = (token: string | null) => {
	if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { getToken, userId, signOut } = useAuth();
	const { user, isLoaded } = useUser(); // Add user and isLoaded
	const [loading, setLoading] = useState(true);
	const { checkAdminStatus, checkProStatus, setProStatus, reset } = useAuthStore(); // Destructure reset
	const { initSocket, disconnectSocket } = useChatStore();

	useEffect(() => {
		const initAuth = async () => {
			console.log('initAuth called'); // Debug log
			try {
				const token = await getToken();
				updateApiToken(token);
				if (token) {
					// Check Pro status first and wait for result
					const proStatus = await checkProStatus();
					setProStatus(proStatus);
					
					// Then check admin status
					await checkAdminStatus();
					
					// init socket
					if (userId) initSocket(userId);
				}
			} catch (error: any) {
				updateApiToken(null);
				console.log("Error in auth provider", error);
			} finally {
				setLoading(false);
			}
		};

		initAuth();

		// clean up
		return () => disconnectSocket();
	}, [getToken, userId, checkAdminStatus, checkProStatus, initSocket, disconnectSocket, setProStatus]);

	useEffect(() => {
		const interceptorId = axiosInstance.interceptors.response.use(
			(response) => response,
			async (error) => {
				if (error.response?.status === 401) {
					try {
						const token = await getToken();
						if (token) {
							updateApiToken(token);
							error.config.headers["Authorization"] = `Bearer ${token}`;
							return axiosInstance(error.config);
						}
					} catch (refreshError) {
						console.error("Failed to refresh token", refreshError);
						signOut();
						// Redirect to login page or handle the error as needed
						window.location.href = "/sign-in"; // Replace with your sign-in route
						return Promise.reject(refreshError);
					}
				}
				return Promise.reject(error);
			}
		);

		return () => {
			axiosInstance.interceptors.response.eject(interceptorId);
		};
	}, [getToken, signOut]);

	useEffect(() => {
		if (isLoaded && !user) {
			reset();
		}
	}, [user, isLoaded, reset]);

	if (loading)
		return (
			<div className='h-screen w-full flex items-center justify-center'>
				<Loader className='size-8 text-emerald-500 animate-spin' />
			</div>
		);

	return <>{children}</>;
};
export default AuthProvider;
