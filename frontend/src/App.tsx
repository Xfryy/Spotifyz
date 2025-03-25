import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/album/AlbumPage";
import AlbumsPage from "./pages/albums/AlbumsPage";
import AdminPage from "./pages/admin/AdminPage";
import SearchPage from "./pages/search/SearchPage";
import PaymentSuccess from "@/pages/payment/success";
import PrivateRoute from "./routes/PrivateRoute";
import PlaylistsPage from "./pages/Playlists/PlaylistsPage";
import PlaylistDetailPage from "./pages/Playlists/PlaylistDetailPage/PlaylistDetailPage";
import UserProfilePage from "@/pages/users/UserProfilePage";
import ExplorePage from "./pages/explore/ExplorePage";

import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage";

function App() {
	return (
		<>
			<Routes>
				<Route
					path='/sso-callback'
					element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={"/auth-callback"} />}
				/>
				<Route path='/auth-callback' element={<AuthCallbackPage />} />
				<Route path='/admin' element={<AdminPage />} />
				<Route path='/payment/success' element={<PaymentSuccess />} />

				<Route element={<MainLayout />}>
					<Route path='/' element={<HomePage />} />
					<Route path='/users/:userId' element={<UserProfilePage />} /> {/* Move this route up */}
					<Route element={<PrivateRoute />}>
						<Route path='/chat' element={<ChatPage />} />
					</Route>
					<Route path='/albums' element={<AlbumsPage />} />
					<Route path='/albums/:albumId' element={<AlbumPage />} />
					<Route path='/search' element={<SearchPage />} />
					<Route path='/playlists' element={<PlaylistsPage />} />
					<Route path='/playlists/:playlistId' element={<PlaylistDetailPage />} />
					<Route path='/explore' element={<ExplorePage />} />
					<Route path='*' element={<NotFoundPage />} />
				</Route>
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
