import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { Paperclip, Send, Mic, Music } from "lucide-react";
import { useState } from "react";

const MessageInput = () => {
	const [newMessage, setNewMessage] = useState("");
	const { user } = useUser();
	const { selectedUser, sendMessage } = useChatStore();

	const handleSend = () => {
		if (!selectedUser || !user || !newMessage) return;
		sendMessage(selectedUser.clerkId, user.id, newMessage.trim());
		setNewMessage("");
	};

	return (
		<div className='p-4 mt-auto border-t border-zinc-800/40 bg-zinc-900/20 backdrop-blur-sm'>
			<div className='flex items-center gap-3'>
				<Button 
					size="icon" 
					variant="ghost" 
					className="shrink-0 hover:bg-zinc-800/80 text-zinc-400 hover:text-white"
					title="Attach file"
				>
					<Paperclip className='size-4' />
				</Button>
                
				<Button 
					size="icon" 
					variant="ghost" 
					className="shrink-0 hover:bg-zinc-800/80 text-zinc-400 hover:text-white"
					title="Share music"
				>
					<Music className='size-4' />
				</Button>

				<div className="flex-1 relative">
					<Input
						placeholder='Message...'
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						className='bg-zinc-800/90 border-none rounded-full px-4 h-10 focus-visible:ring-1 focus-visible:ring-spotify-green/50'
						onKeyDown={(e) => e.key === "Enter" && handleSend()}
					/>
				</div>

				{newMessage.trim() ? (
					<Button 
						size="icon" 
						onClick={handleSend}
						className="shrink-0 bg-spotify-green hover:bg-spotify-green/90 text-black rounded-full"
					>
						<Send className='size-4' />
					</Button>
				) : (
					<Button 
						size="icon" 
						variant="ghost"
						className="shrink-0 hover:bg-zinc-800/80 text-zinc-400 hover:text-white"
						title="Voice message"
					>
						<Mic className='size-4' />
					</Button>
				)}
			</div>
		</div>
	);
};
export default MessageInput;