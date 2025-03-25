import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";
import { PlaybackControls } from "./components/PlaybackControls";
import { useEffect, useState } from "react";
import UpgradeModal from "@/components/UpgradeModal";

const MainLayout = () => {
	const [isMobile, setIsMobile] = useState(false);
	const [showUpgradeModal, setShowUpgradeModal] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	return (
		<>
			<div className='h-screen bg-spotify-black text-white flex flex-col overflow-hidden'>
				<ResizablePanelGroup direction='horizontal' className='flex-1 flex h-full overflow-hidden'>
					<AudioPlayer />
					{/* left sidebar */}
					<ResizablePanel 
						defaultSize={20} 
						minSize={isMobile ? 0 : 15} 
						maxSize={25}
						className="bg-black"
					>
						<LeftSidebar />
					</ResizablePanel>

					<ResizableHandle className='w-[1px] bg-zinc-800 transition-colors' />

					{/* Main content */}
					<ResizablePanel defaultSize={isMobile ? 80 : 60} className="bg-gradient-to-b from-zinc-900/70 to-spotify-black">
						<Outlet />
					</ResizablePanel>

					{!isMobile && (
						<>
							<ResizableHandle className='w-[1px] bg-zinc-800 transition-colors' />

							{/* right sidebar */}
							<ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsedSize={0} className="bg-black">
								<FriendsActivity />
							</ResizablePanel>
						</>
					)}
				</ResizablePanelGroup>

				<PlaybackControls />
			</div>
			{showUpgradeModal && (
				<UpgradeModal setShowUpgradeModal={setShowUpgradeModal} />
			)}
		</>
	);
};
export default MainLayout;