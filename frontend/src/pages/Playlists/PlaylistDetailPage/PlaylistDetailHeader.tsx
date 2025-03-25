import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios"; // Fix import path

interface PlaylistHeaderProps {
  imageUrl: string;
  title: string;
  ownerName: string;
  ownerId: string;
  songCount: number;
  totalDuration: number;
  backgroundGradient: string;
}

const PlaylistHeader = ({ 
  imageUrl, 
  title, 
  ownerName, 
  ownerId, 
  songCount, 
  totalDuration, 
  backgroundGradient 
}: PlaylistHeaderProps) => {
  const [owner, setOwner] = useState<{imageUrl: string} | null>(null);
  
  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const response = await axiosInstance.get(`/users/byClerkId/${ownerId}`);
        setOwner(response.data);
      } catch (error) {
        console.error('Failed to fetch owner:', error);
      }
    };

    if (ownerId) {
      fetchOwner();
    }
  }, [ownerId]);

  // Format duration in Spotify style (just minutes)
  const totalMinutes = Math.floor(totalDuration / 60);
  const durationText = `about ${totalMinutes} min`;

  return (
    <div
      className="pt-24 px-8 pb-6 flex flex-col md:flex-row gap-6"
      style={{
        background: backgroundGradient || "linear-gradient(to bottom, rgba(40, 40, 40, 0.8), #121212)",
      }}
    >
      {/* Playlist Cover */}
      <div className="w-[232px] h-[232px] shadow-2xl rounded overflow-hidden flex-shrink-0">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Playlist Info */}
      <div className="flex flex-col justify-end">
        <p className="text-xs font-bold uppercase tracking-widest mb-2">Playlist</p>
        <h1 className="text-6xl md:text-8xl font-black mb-6 text-white leading-tight">{title}</h1>
        
        <div className="flex flex-col text-sm text-zinc-300 space-y-1">
          {/* Playlist Description - typically seen in Spotify */}
          <p className="text-zinc-300">Your favorite tracks, all in one place.</p>
          
          {/* Owner and stats row */}
          <div className="flex items-center gap-1 mt-2">
            <Avatar className="w-6 h-6">
              <AvatarImage 
                src={owner?.imageUrl} 
                alt={ownerName} 
              />
              <AvatarFallback>{ownerName[0]}</AvatarFallback>
            </Avatar>
            <Link 
              to={`/users/${ownerId}`} 
              className="font-semibold text-white hover:underline"
            >
              {ownerName}
            </Link>
            <span className="text-zinc-400 mx-1">•</span>
            <span className="text-zinc-400">{songCount} songs,</span>
            <span className="text-zinc-400">{durationText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistHeader;