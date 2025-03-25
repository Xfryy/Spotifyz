import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/useChatStore";
import { Info, MoreHorizontal, Phone, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatHeader = () => {
	const { selectedUser, onlineUsers, userActivities } = useChatStore();

	if (!selectedUser) return null;

	const isOnline = onlineUsers.has(selectedUser.clerkId);
	const activity = userActivities.get(selectedUser.clerkId);
	const isListening = activity && activity !== "Idle";

	return (
		<div className='p-4 border-b border-zinc-800/50 backdrop-blur-sm bg-zinc-900/30 flex justify-between items-center'>
			<div className='flex items-center gap-3'>
				<Avatar className="ring-1 ring-zinc-800">
					<AvatarImage src={selectedUser.imageUrl} />
					<AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
				</Avatar>
				<div>
					<h2 className='font-medium text-white'>{selectedUser.fullName}</h2>
					<div className='text-xs flex items-center gap-1.5'>
						<span className={`size-2 rounded-full ${isOnline ? "bg-emerald-500" : "bg-zinc-500"}`}></span>
						<p className='text-zinc-400'>
							{isListening 
								? "Listening now" 
								: isOnline 
									? "Online" 
									: "Offline"}
						</p>
					</div>
				</div>
			</div>

			<div className="flex items-center gap-1">
				{isListening && (
					<Button size="icon" variant="ghost" className="hover:bg-zinc-800 text-spotify-green" title="See what they're playing">
						<Music className="size-4" />
					</Button>
				)}
				<Button size="icon" variant="ghost" className="hover:bg-zinc-800" title="Call">
					<Phone className="size-4" />
				</Button>
				<Button size="icon" variant="ghost" className="hover:bg-zinc-800" title="Info">
					<Info className="size-4" />
				</Button>
				<Button size="icon" variant="ghost" className="hover:bg-zinc-800" title="More options">
					<MoreHorizontal className="size-4" />
				</Button>
			</div>
		</div>
	);
};
export default ChatHeader;