import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import {
  LayoutDashboardIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  MessageCircle,
  CrownIcon,
  BellIcon,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatbotStore } from "@/stores/useChatbotStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../components/ui/button";
import ChatBubble from "@/components/ChatBubble";
import ProDetailsModal from "@/components/ProDetailsModal";
import { useState, useRef } from "react";
import LoginModal from "@/components/LoginModal";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  setShowUpgradeModal: (show: boolean) => void;
}

const Header = ({ setShowUpgradeModal }: HeaderProps) => {
  const { isAdmin, isPro } = useAuthStore();
  const { isOpen, toggleChat } = useChatbotStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const searchInputRef = useRef(null);

  const handleGoBack = () => navigate(-1);
  const handleGoForward = () => navigate(1);
  const handleNavigateToSearch = () => navigate('/search');

  return (
    <>
      <div className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/95 backdrop-blur-md z-50 border-b border-zinc-800'>
        {/* Left section */}
        <div className='flex gap-4 items-center'>
          <div className="flex items-center gap-2">
            <button
              onClick={handleGoBack}
              className="bg-black/40 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full p-2 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleGoForward}
              className="bg-black/40 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full p-2 transition-colors"
              aria-label="Go forward"
            >
              <ChevronRight size={16} />
            </button>
          </div>


          <motion.div
            className="ml-4 relative flex items-center"
            initial={false}
            animate={{
              width: isSearchPage ? '40px' : '16rem'
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            <div className="relative flex items-center w-full">
              <motion.div
                className="z-10 bg-zinc-800 hover:bg-zinc-700 rounded-full p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                onClick={handleNavigateToSearch}
                animate={{
                  scale: isSearchPage ? 1.1 : 1
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25
                }}
              >
                <Search size={18} />
              </motion.div>

              <AnimatePresence>
                {!isSearchPage && (
                  <motion.input
                    ref={searchInputRef}
                    type="text"
                    placeholder="What do you want to listen to?"
                    className="bg-zinc-800 hover:bg-zinc-700 focus:bg-zinc-700 text-white text-sm rounded-full py-2 pl-10 pr-4 w-full outline-none focus:outline-white focus:outline-1 transition-colors absolute left-0"
                    onClick={handleNavigateToSearch}
                    readOnly
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
        {/* Right section */}
        <div className='flex items-center gap-3'>
          <SignedIn>

            {/* Notification Bell */}
            <button className="bg-black/40 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full p-2 transition-colors">
              <BellIcon size={18} />
            </button>

            {/* Pro/Crown Icon */}
            {isPro && (
              <button
                onClick={() => setIsProModalOpen(true)}
                className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-full p-2 hover:scale-105 transition-transform"
                aria-label="Pro Subscription Details"
              >
                <CrownIcon className="h-4 w-4 text-white" />
              </button>
            )}

            {/* AI Chat Button */}
            {isPro && (
              <button
                onClick={toggleChat}
                className={`bg-black/40 hover:bg-zinc-800 rounded-full p-2 transition-colors ${isOpen ? 'text-green-500' : 'text-zinc-400 hover:text-white'}`}
                aria-label="AI Music Assistant"
              >
                <MessageCircle size={18} />
              </button>
            )}

            {/* Admin Dashboard Link */}
            {isAdmin && (
              <Link
                to={"/admin"}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "bg-black/40 border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:text-white"
                )}
              >
                <LayoutDashboardIcon className='size-4 mr-2' />
                Admin
              </Link>
            )}

            {/* Upgrade Button */}
            {!isPro && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="bg-black/40 hover:bg-zinc-800 text-zinc-200 font-bold rounded-full px-5 py-1.5 hover:scale-105 transition-all border border-zinc-700 hover:border-white"
              >
                Upgrade
              </button>
            )}

            {/* User Profile Button - Custom styling for Clerk's UserButton */}
            <div className="ml-1">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-7 h-7",
                    userButtonTrigger: "bg-black/40 hover:bg-zinc-800 rounded-full p-1 transition-colors"
                  }
                }}
                userProfileMode="modal"
              />
            </div>
          </SignedIn>

          <SignedOut>
            {/* Login Button */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-zinc-400 hover:text-white text-sm font-semibold bg-transparent hover:bg-zinc-800 rounded-full px-3 py-1.5 transition-all mr-1"
            >
              Log in
            </button>

            {/* Sign Up Button */}
            <button
              onClick={() => setIsSignUpModalOpen(true)}
              className="bg-white hover:bg-zinc-200 text-black font-bold rounded-full px-6 py-1.5 hover:scale-105 transition-transform"
            >
              Sign up
            </button>
          </SignedOut>
        </div>
      </div>

      {/* Chatbot Component */}
      {isPro && <ChatBubble />}

      {/* Modals */}
      {isPro && (
        <ProDetailsModal isOpen={isProModalOpen} onClose={() => setIsProModalOpen(false)} />
      )}
      <LoginModal
        open={isLoginModalOpen || isSignUpModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setIsSignUpModalOpen(false);
        }}
        defaultMode={isSignUpModalOpen ? "signup" : "login"}
      />
    </>
  );
};

export default Header;
