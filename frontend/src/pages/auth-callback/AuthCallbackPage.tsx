import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const syncAttempted = useRef(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user || syncAttempted.current) return;

      try {
        syncAttempted.current = true;

        await axiosInstance.post("/auth/callback", {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        });
      } catch (error) {
        console.log("Error in auth callback", error);
      } finally {
        navigate("/");
      }
    };

    syncUser();
  }, [isLoaded, user, navigate]);

  useEffect(() => {
    // Show content after logo animation
    const timer = setTimeout(() => setShowContent(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='h-screen w-full bg-black flex items-center justify-center'>
      <div className="flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="w-24 h-24 logo-animation">
          <svg viewBox="0 0 24 24" fill="#1ed75f">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.762.491-1.152.241-3.15-1.92-7.11-2.35-11.781-1.29-.418.091-.842-.189-.932-.611-.091-.418.189-.842.611-.932 5.112-1.161 9.54-.66 13.041 1.441.39.237.491.761.241 1.152zm1.472-3.272c-.301.481-.881.615-1.362.314-3.611-2.22-9.111-2.862-13.381-1.565-.523.151-1.068-.149-1.219-.672-.149-.523.149-1.068.672-1.219 4.891-1.489 10.891-.748 15.012 1.767.462.294.615.881.314 1.362zm.129-3.409C15.321 8.754 8.849 8.541 5.208 9.403c-.627.15-1.252-.221-1.409-.84-.15-.627.221-1.252.84-1.409 4.271-1.002 11.401-.721 15.901 1.359.551.292.761.991.476 1.549-.291.543-.99.761-1.549.469z"/>
          </svg>
        </div>

        {/* Content that fades in after logo */}
        {showContent && (
          <Card className='w-[90%] max-w-md bg-zinc-900 border-zinc-800 fade-transition'>
            <CardContent className='flex flex-col items-center gap-4 pt-6'>
              <div className='size-6 text-emerald-500'>
                <svg className="animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </div>
              <h3 className='text-zinc-400 text-xl font-bold'>Logging you in</h3>
              <p className='text-zinc-400 text-sm'>Please wait a moment...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AuthCallbackPage;
