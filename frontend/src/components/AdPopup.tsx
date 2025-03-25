import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { toast } from "react-toastify";
import { axiosInstance } from "@/lib/axios";

interface AdPopupProps {
  onClose: () => void;
  onNextAd?: () => void;
}

const AdPopup = ({ onClose, onNextAd }: AdPopupProps) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isAdFinished, setIsAdFinished] = useState(false);
  
  const ads = [
    {
      image: "/adversitement/fotoiklan1.jpg",
      audio: "/adversitement/Spotify Premium Ad 1.mp3",
      title: "Upgrade to Premium!",
      description: "Enjoy ad-free music, download and offline listening, and unlimited skips. Upgrade now for the ultimate music experience."
    },
    {
      image: "/adversitement/fotoiklan2.jpg",
      audio: "/adversitement/Spotify Premium Ad 1.mp3",
      title: "Premium Experience",
      description: "Download your favorite songs, Chat with an ai asistant, and enjoy the highest quality audio. Try Premium today!"
    }
  ];

  const currentAd = ads[currentAdIndex];
  const adAudioRef = useRef<HTMLAudioElement>(null);
  const closeButtonTimerRef = useRef<number | undefined>(undefined);
  const autoCloseTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Pause global audio when ad popup appears
    usePlayerStore.setState({ isPlaying: false });
  }, []);

  useEffect(() => {
    // Only reset finished state when changing ads
    setIsAdFinished(false);
    
    if (currentAdIndex === 0) {
      // For first ad: play audio and auto-slide after 15 seconds
      if (adAudioRef.current) {
        adAudioRef.current.play();
      }
      const timer = setTimeout(() => {
        setCurrentAdIndex(1);
        if (onNextAd) onNextAd();
      }, 15000);
      return () => clearTimeout(timer);
    }
    
    if (currentAdIndex === 1) {

      const currentAudioTime = adAudioRef.current ? adAudioRef.current.currentTime : 0;
      const timeToCloseButton = Math.max(0, 30000 - (currentAudioTime * 1000));
      const timeToAutoClose = Math.max(0, 40000 - (currentAudioTime * 1000));
      
      closeButtonTimerRef.current = setTimeout(() => {
        setIsAdFinished(true);
      }, timeToCloseButton) as unknown as number;
      
      autoCloseTimerRef.current = setTimeout(() => {
        onClose();
      }, timeToAutoClose) as unknown as number;
      
      return () => {
        clearTimeout(closeButtonTimerRef.current);
        clearTimeout(autoCloseTimerRef.current);
      };
    }
  }, [currentAdIndex, onNextAd, onClose]);

  const handleAudioMetadata = () => {
    if (adAudioRef.current) {
      setAudioDuration(adAudioRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (adAudioRef.current) {
      setCurrentTime(adAudioRef.current.currentTime);
    }
  };

  const handleAudioEnded = () => { /* no-op for first ad */ };

  const handleAudioEndedForAd2 = () => {
    setTimeout(() => {
      setIsAdFinished(true);
    }, 30000);
    setTimeout(() => {
      onClose();
    }, 40000);
    // Optionally cleanup timers if needed
  };

  const handleNextOrClose = () => {
    // In the new flow, when on second ad, clicking will close the popup.
    onClose();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  // New upgrade function that calls Stripe checkout session endpoint
  const handleUpgrade = async () => {
    try {
      const response = await axiosInstance.post("/payment/create-checkout-session");
      window.location.href = response.data.url;
    } catch (error: any) {
      toast.error("Failed to initiate checkout");
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden relative">
        {/* Advertisement image */}
        <div className="relative h-52 w-full">
          <img 
            src={currentAd.image}
            alt={currentAd.title}
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-60"></div>
        </div>

        {/* Advertisement content */}
        <div className="p-6 pt-4">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center mr-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.5 16.5C16.23 16.5 15.96 16.38 15.77 16.18C14.58 14.91 12.8 14 11 14C9.2 14 7.42 14.91 6.23 16.18C6.04 16.38 5.77 16.5 5.5 16.5C4.94 16.5 4.5 16.05 4.5 15.5C4.5 15.24 4.61 14.98 4.79 14.79C6.38 13.09 8.69 12 11 12C13.31 12 15.62 13.09 17.21 14.79C17.39 14.98 17.5 15.24 17.5 15.5C17.5 16.05 17.06 16.5 16.5 16.5ZM16.5 12C15.12 12 14 10.88 14 9.5C14 8.12 15.12 7 16.5 7C17.88 7 19 8.12 19 9.5C19 10.88 17.88 12 16.5 12ZM5.5 12C4.12 12 3 10.88 3 9.5C3 8.12 4.12 7 5.5 7C6.88 7 8 8.12 8 9.5C8 10.88 6.88 12 5.5 12Z" fill="currentColor" />
              </svg>
            </div>
            <span className="text-xs text-white font-semibold uppercase tracking-wider">Sponsored</span>
          </div>
          
          <h2 className="text-2xl font-bold mb-2 text-white">{currentAd.title}</h2>
          <p className="mb-4 text-sm text-zinc-300">{currentAd.description}</p>
          
          {/* Audio element - single instance for both ads */}
          <div className="mb-4">
            <audio
              ref={adAudioRef}
              src={ads[0].audio} // Always use the same audio source
              autoPlay
              onLoadedMetadata={handleAudioMetadata}
              onTimeUpdate={handleTimeUpdate}
              onEnded={currentAdIndex === 1 ? handleAudioEndedForAd2 : handleAudioEnded}
              className="hidden"
            />
            
            <div className="mb-2">
              <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(currentTime / audioDuration) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-zinc-400">
              <span>{formatTime(currentTime)}</span>
            </div>
          </div>
          
          {/* Action button */}
          <div className="flex">
            <Button 
              className="w-full bg-green-500 hover:bg-green-600 text-black font-medium"
              onClick={handleUpgrade}
            >
              Upgrade Now
            </Button>
          </div>
          
          {/* Close button for second ad */}
          {currentAdIndex === 1 && isAdFinished && (
            <Button 
              onClick={handleNextOrClose}
              className="w-full mt-3 bg-zinc-800 hover:bg-zinc-700 text-white"
            >
              Close
            </Button>
          )}
          
          {/* Ad indicator */}
          <div className="flex justify-center mt-4 gap-2">
            {ads.map((_, index) => (
              <div 
                key={`indicator-${index}`}
                className={`h-1 rounded-full transition-all ${index === currentAdIndex ? 'w-6 bg-green-500' : 'w-2 bg-zinc-700'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdPopup;
