import { useUser } from "@clerk/clerk-react";

const HuTaoMusicBanner = () => {
  const { user } = useUser();

  return (
    <div className="relative w-full overflow-hidden rounded-lg mb-8 mt-6 bg-zinc-800/60 hover:bg-zinc-700/60 transition-colors">
      <div className="flex items-center p-4 sm:p-6">
        {/* Gif Container */}
        <div className="mr-4 sm:mr-6 flex-shrink-0">
          <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 shadow-lg relative group">
            <img 
              src="/hu-tao-music.gif" 
              alt="Hu Tao listening to music"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Text Content */}
        <div className="flex-1">
          <div className="flex items-center">
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
              Welcome <span className="text-xs text-green-500 font-bold">{user?.firstName || "Guest ! "}</span>
            </p>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-1">Here are the best to play music!</h2>
          <p className="text-sm text-zinc-400 mt-1">
            The hottest tracks selected by Wangsheng Funeral Parlor's Director
          </p>
          
          <div className="flex items-center mt-3 text-xs text-zinc-400">
            <img 
              src="/spotify.png"
              alt="Spotifyz" 
              className="h-5 w-5 rounded-full mr-2"
            />
            <span className="font-semibold text-white">Spotifyz</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HuTaoMusicBanner;
