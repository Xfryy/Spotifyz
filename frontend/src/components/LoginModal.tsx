import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSignIn, useSignUp } from "@clerk/clerk-react";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  defaultMode?: "login" | "signup";
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, defaultMode = "login" }) => {
  const [isLogin, setIsLogin] = useState(defaultMode === "login");
  
  // Effect to update isLogin when defaultMode changes
  useEffect(() => {
    setIsLogin(defaultMode === "login");
  }, [defaultMode]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState("");
  const { handleAuthCallback } = useAuthStore();
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();

  if (!isSignInLoaded || !isSignUpLoaded) {
    return null;
  }

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("processing");
    
    try {
      if (isLogin) {
        // Login with existing email
        await signIn.create({
          identifier: email,
          password,
        });
        
        // Complete the first factor
        const result = await signIn.attemptFirstFactor({
          strategy: "password",
          password,
        });
        
        if (result.status === "complete") {
          // Get user data and complete the auth flow
          await completeAuthProcess();
        } else {
          setStatus("error");
        }
      } else {
        // Sign up with new email
        await signUp.create({
          emailAddress: email,
          password,
        });
        
        // Start email verification
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        
        setIsVerifying(true);
        setStatus("verification_sent");
      }
    } catch (error) {
      console.error(isLogin ? "Login error:" : "Signup error:", error);
      setStatus("error");
    }
  };
  
  const verifyEmail = async () => {
    setStatus("verifying");
    
    try {
      // Attempt verification
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });
      
      if (result.status === "complete") {
        // Get user data and complete the auth flow
        await completeAuthProcess();
      } else {
        setStatus("verification_error");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("verification_error");
    }
  };
  
  const completeAuthProcess = async () => {
    try {
      const currentUser = useAuthStore.getState().user;
      
      if (currentUser) {
        // Pass userData to your backend
        const userData = {
          id: currentUser.id,
          email: currentUser.emailAddresses[0]?.emailAddress,
          firstName: currentUser.firstName || email.split("@")[0],
          lastName: currentUser.lastName || "",
          imageUrl: currentUser.imageUrl || "/default-avatar.png"
        };
        
        await handleAuthCallback(userData);
        onClose();
        window.location.href = "/auth-callback";
      }
    } catch (error) {
      console.error("Error completing auth process:", error);
      setStatus("error");
    }
  };

  // If verifying email
  if (isVerifying) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader className="flex flex-col items-center text-center">
            <div className="flex gap-2 items-center mb-6">
              <img src='/spotify.png' className='size-10' alt='Spotifyz logo' />
              <span className="text-xl font-bold">Spotifyz</span>
            </div>
            <DialogTitle className="text-2xl font-bold mb-2">
              Verify your email
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <p className="text-center text-zinc-300">
              We've sent a verification code to <span className="font-medium text-white">{email}</span>
            </p>
            <div className="space-y-2">
              <label htmlFor="verificationCode" className="text-sm font-medium text-zinc-200 block">
                Verification Code
              </label>
              <Input
                id="verificationCode"
                placeholder="Enter verification code"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 h-10"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
            {status === "verification_error" && (
              <div className="text-red-500 text-sm text-center">
                Invalid verification code. Please try again.
              </div>
            )}
            <Button 
              onClick={verifyEmail} 
              disabled={status === "verifying"}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-full"
            >
              {status === "verifying" ? "Verifying..." : "Verify Email"}
            </Button>
            <div className="text-center">
              <button 
                onClick={() => setIsVerifying(false)} 
                className="text-zinc-400 hover:text-white underline text-sm"
              >
                Back to sign up
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Regular login/signup form
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="flex gap-2 items-center mb-4">
            <img src='/spotify.png' className='size-10' alt='Spotifyz logo' />
            <span className="text-xl font-bold">Spotifyz</span>
          </div>
          <DialogTitle className="text-2xl font-bold mb-2">
            {isLogin ? "Log in to Spotifyz" : "Sign up for Spotifyz"}
          </DialogTitle>
        </DialogHeader>
        
        {/* Banner with Hu Tao GIF */}
        <div className="relative w-full h-32 mb-4 overflow-hidden rounded-lg">
          <img 
            src="/hutao-dance.gif" 
            alt="Hu Tao" 
            className="absolute w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center">
            <p className="text-white font-semibold text-lg text-center">Write carefully</p>
            <p className="text-white text-sm text-center">Your email and password</p>
          </div>
        </div>
        
        <div className="grid gap-4 py-2">
          <SignInOAuthButtons />
          <div className="relative flex items-center justify-center">
            <hr className="w-full border-zinc-700" />
            <span className="absolute bg-zinc-900 px-3 text-zinc-400 text-sm">or</span>
          </div>
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-zinc-200 block">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 h-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-zinc-200 block">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 h-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {status === "error" && (
              <div className="text-red-500 text-sm text-center">
                {isLogin ? "Invalid email or password" : "Failed to create account. Try a different email."}
              </div>
            )}
            <div className="pt-1">
              <Button 
                type="submit" 
                disabled={status === "processing"}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-full"
              >
                {status === "processing" ? 
                  (isLogin ? "Logging in..." : "Signing up...") : 
                  (isLogin ? "Log In" : "Sign Up")}
              </Button>
            </div>
          </form>
          <div className="text-center">
            {isLogin && (
              <a href="#" className="text-zinc-400 hover:text-white underline text-sm">
                Forgot your password?
              </a>
            )}
          </div>
        </div>
        <div className="border-t border-zinc-800 pt-3 text-center text-zinc-400 text-sm">
          <span>{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setStatus("");
              setIsVerifying(false);
            }} 
            className="text-white hover:underline font-medium"
          >
            {isLogin ? "Sign up for Spotifyz" : "Log in to Spotifyz"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
