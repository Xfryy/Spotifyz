import Topbar from "@/components/Topbar";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";
import { Music } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import UpgradeModal from "@/components/UpgradeModal";

const formatTime = (date: string) => {
	return new Date(date).toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};

const ChatPage = () => {
	const { user } = useUser();
	const { messages, selectedUser, fetchUsers, fetchMessages, clearMessages, userActivities } = useChatStore();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const messagesFetchedRef = useRef<Record<string, boolean>>({});
	const { isPro, checkProStatus } = useAuthStore();
	const navigate = useNavigate();
	const [showUpgradeModal, setShowUpgradeModal] = useState(false);

	useEffect(() => {
		if (!user) {
			navigate('/sign-in');
			return;
		}

		const init = async () => {
			// Check pro status but don't restrict access
			await checkProStatus();
			fetchUsers();
		};

		init();
	}, [user, navigate, checkProStatus, fetchUsers]);

	useEffect(() => {
		if (selectedUser) {
			clearMessages();
			fetchMessages(selectedUser.clerkId);
			messagesFetchedRef.current[selectedUser.clerkId] = true;
		}
	}, [selectedUser, fetchMessages, clearMessages]);
	
	useEffect(() => {
		// Scroll to bottom when new messages come in
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Get user's current activity if available
	const selectedUserActivity = selectedUser 
		? userActivities.get(selectedUser.clerkId) 
		: null;

	return (
		<main className='h-full overflow-hidden flex flex-col'>
			<Topbar setShowUpgradeModal={setShowUpgradeModal} />

			<div className='grid lg:grid-cols-[280px_1fr] grid-cols-[80px_1fr] flex-1 h-[calc(100vh-180px)]'>
				<UsersList />

				{/* chat message */}
				<div className='flex flex-col h-full bg-gradient-to-b from-zinc-900/50 to-spotify-black border-l border-zinc-800/50'>
					{selectedUser ? (
						<>
							<ChatHeader />

							{/* Messages area with subtle background */}
							<ScrollArea className='h-[calc(100vh-340px)] pt-2'>
								<div className='px-4 py-2 space-y-4'>
									{messages.length > 0 ? (
										<>
											{messages.map((message) => (
												<div
													key={message._id}
													className={`flex items-start gap-3 ${
														message.senderId === user?.id ? "flex-row-reverse" : ""
													}`}
												>
													<Avatar className='size-8 ring-1 ring-zinc-800/80'>
														<AvatarImage
															src={
																message.senderId === user?.id
																	? user.imageUrl
																	: selectedUser.imageUrl
															}
														/>
													</Avatar>

													<div
														className={`rounded-2xl p-3 max-w-[70%] shadow-md
															${
																message.senderId === user?.id 
																	? "bg-spotify-green text-black" 
																	: "bg-zinc-800/90"
															}
														`}
													>
														<p className='text-sm leading-relaxed'>{message.content}</p>
														<span className={`text-xs mt-1 block opacity-70 ${
															message.senderId === user?.id 
																? "text-spotify-black" 
																: "text-zinc-400"
														}`}>
															{formatTime(message.createdAt)}
														</span>
													</div>
												</div>
											))}
											<div ref={messagesEndRef} />
										</>
									) : (
										<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
											<div className="bg-zinc-800/50 rounded-full p-4 mb-4">
												<Music className="size-6 text-spotify-green" />
											</div>
											<h3 className="text-lg font-medium text-white mb-2">Start a conversation</h3>
											<p className="text-sm text-zinc-400 max-w-xs">
												Say hello to {selectedUser.fullName} and start sharing music recommendations!
											</p>
											
											{selectedUserActivity && selectedUserActivity !== "Idle" && (
												<div className="mt-4 bg-zinc-800/30 p-3 rounded-lg">
													<p className="text-xs text-zinc-400">Currently listening to:</p>
													<p className="text-sm text-spotify-green font-medium mt-1">
														{selectedUserActivity.replace("Playing ", "")}
													</p>
												</div>
											)}
										</div>
									)}
								</div>
							</ScrollArea>

							<MessageInput />
						</>
					) : (
						<NoConversationPlaceholder />
					)}
				</div>
			</div>
			{showUpgradeModal && !isPro && <UpgradeModal setShowUpgradeModal={setShowUpgradeModal} />}
		</main>
	);
};
export default ChatPage;

const NoConversationPlaceholder = () => (
	<div className='flex flex-col items-center justify-center h-full space-y-6'>
		<div className="relative">
			<div className="absolute inset-0 bg-spotify-green rounded-full opacity-20 animate-pulse-spotify" />
			<img src='/spotify.png' alt='Spotify' className='size-16 relative z-10' />
		</div>
		<div className='text-center max-w-xs'>
			<h3 className='text-zinc-200 text-lg font-medium mb-2'>Connect Through Music</h3>
			<p className='text-zinc-400 text-sm'>
				Choose a friend from the list to start sharing your music journey together
			</p>
		</div>
	</div>
);