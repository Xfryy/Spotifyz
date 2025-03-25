import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { Library, Plus, Search, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { useState } from "react";
import LoginModal from "@/components/LoginModal";

interface LibrarySectionProps {
    setShowModal: (show: boolean) => void;
}

const LibrarySection = ({ setShowModal }: LibrarySectionProps) => {
    const { playlists, isLoading } = usePlaylistStore();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    return (
        <div className='flex-1 bg-zinc-900 rounded-lg mx-2 overflow-hidden'>
            <div className='p-4 pb-0'>
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-2 text-zinc-400 font-medium'>
                        <Library className='size-5' />
                        <span>Your Library</span>
                    </div>
                    <SignedIn>
                        <div className='flex items-center gap-2'>
                            <Button
                                variant='ghost'
                                size='sm'
                                className='text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full h-8 w-8 p-0'
                            >
                                <Search className='h-4 w-4' />
                            </Button>
                            <Button
                                variant='ghost'
                                size='sm'
                                className='text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full h-8 w-8 p-0'
                                onClick={() => setShowModal(true)}
                            >
                                <Plus className='h-4 w-4' />
                            </Button>
                        </div>
                    </SignedIn>
                </div>

                {/* Filter chips */}
                <SignedIn>
                    <div className='flex gap-2 pb-4 overflow-x-auto'>
                        <Link
                            to="/playlists"
                            className='bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium py-1 px-3 rounded-full whitespace-nowrap transition-colors'
                        >
                            Playlists
                        </Link>
                        <div className='bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium py-1 px-3 rounded-full whitespace-nowrap'>
                            Artists
                        </div>
                        <div className='bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium py-1 px-3 rounded-full whitespace-nowrap'>
                            Albums
                        </div>
                    </div>
                </SignedIn>
            </div>

            <ScrollArea className='h-[calc(100vh-260px)] px-2'>
                <SignedIn>
                    <div className='space-y-2 p-2'>
                        {isLoading ? (
                            <PlaylistSkeleton />
                        ) : playlists.length > 0 ? (
                            playlists.map((playlist) => (
                                <Link
                                    key={playlist._id}
                                    to={`/playlists/${playlist._id}`}
                                    className='flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer'
                                >
                                    <img 
                                        src={playlist.imageUrl} 
                                        alt={playlist.title}
                                        className='w-10 h-10 rounded flex-shrink-0 object-cover'
                                        onError={(e) => {
                                            // Fallback jika gambar error
                                            const target = e.target as HTMLImageElement;
                                            target.src = "/playlists/default.jpg";
                                        }}
                                    />
                                    <div>
                                        <div className='text-white text-sm font-medium'>{playlist.title}</div>
                                        <div className='text-zinc-400 text-xs'>
                                            Playlist • {playlist.ownerName || "You"}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className='flex flex-col gap-4 pt-4'>
                                <div className='text-white font-bold'>Create your first playlist</div>
                                <div className='text-zinc-400 text-sm'>It's easy, we'll help you</div>
                                <Button 
                                    className='bg-white text-black hover:bg-gray-200 text-sm font-bold rounded-full py-1 w-40'
                                    onClick={() => setShowModal(true)}
                                >
                                    Create playlist
                                </Button>
                            </div>
                        )}
                    </div>
                </SignedIn>
                
                <SignedOut>
                    <div className='p-6 flex flex-col items-center justify-center gap-6 h-full'>
                        <div className='relative'>
                            <div className='absolute -inset-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full blur-lg opacity-75 animate-pulse' />
                            <div className='relative bg-zinc-900 rounded-full p-4'>
                                <LogIn className='size-8 text-fuchsia-400' />
                            </div>
                        </div>

                        <div className='text-center'>
                            <h3 className='text-white font-bold mb-2'>Create your first playlist</h3>
                            <p className='text-zinc-400 text-sm'>Log in to create and share playlists.</p>
                        </div>

                        <button 
                            onClick={() => setIsLoginModalOpen(true)}
                            className='bg-white hover:bg-gray-100 text-black font-bold px-8 py-3 rounded-full transition-all'
                        >
                            Log in
                        </button>
                    </div>
                </SignedOut>
            </ScrollArea>

            {/* Login Modal */}
            <LoginModal 
                open={isLoginModalOpen} 
                onClose={() => setIsLoginModalOpen(false)} 
            />
        </div>
    );
};

export default LibrarySection;