import { useSignIn } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { Smartphone } from "lucide-react";
import { useState } from "react";

const SignInOAuthButtons = () => {
	const { signIn, isLoaded } = useSignIn();
	const [isPhoneSignInStarted, setIsPhoneSignInStarted] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState("");
	const [verificationCode, setVerificationCode] = useState("");
	const [status, setStatus] = useState("");

	if (!isLoaded) {
		return null;
	}

	const signInWithGoogle = () => {
		signIn.authenticateWithRedirect({
			strategy: "oauth_google",
			redirectUrl: "/sso-callback",
			redirectUrlComplete: "/auth-callback",
		});
	};

	const startPhoneSignIn = async () => {
		try {
			setStatus("sending");
			await signIn.create({
				strategy: "phone_code",
				identifier: phoneNumber,
			});
			setIsPhoneSignInStarted(true);
			setStatus("sent");
		} catch (error) {
			console.error("Error sending verification code:", error);
			setStatus("error");
		}
	};

	const completePhoneSignIn = async () => {
		try {
			setStatus("verifying");
			const result = await signIn.attemptFirstFactor({
				strategy: "phone_code",
				code: verificationCode,
			});
			
			if (result.status === "complete") {
				// Navigate to auth callback
				window.location.href = "/auth-callback";
			} else {
				setStatus("verification_error");
			}
		} catch (error) {
			console.error("Error verifying code:", error);
			setStatus("verification_error");
		}
	};

	if (isPhoneSignInStarted) {
		return (
			<div className="flex flex-col gap-3">
				<div className="text-sm text-zinc-300 mb-2">
					We sent a verification code to {phoneNumber}
				</div>
				<input
					type="text"
					value={verificationCode}
					onChange={(e) => setVerificationCode(e.target.value)}
					placeholder="Enter verification code"
					className="bg-zinc-800 border border-zinc-700 text-white p-3 rounded-md"
				/>
				{status === "verification_error" && (
					<div className="text-red-500 text-sm">Invalid verification code. Please try again.</div>
				)}
				<Button 
					onClick={completePhoneSignIn} 
					disabled={status === "verifying"}
					className="bg-green-500 hover:bg-green-400 text-black rounded-full py-6 font-medium"
				>
					{status === "verifying" ? "Verifying..." : "Verify Phone Number"}
				</Button>
				<Button 
					onClick={() => setIsPhoneSignInStarted(false)} 
					variant="outline" 
					className="bg-transparent border-zinc-700 hover:bg-zinc-800 text-white rounded-full py-6"
				>
					Back
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			<Button 
				onClick={signInWithGoogle} 
				variant="outline" 
				className="bg-transparent border-zinc-700 hover:bg-zinc-800 text-white rounded-full py-6 font-medium flex gap-3 items-center justify-center"
			>
				<img src='/google.png' alt='Google' className='size-5' />
				<span>Continue with Google</span>
			</Button>
			
			{isPhoneSignInStarted ? (
				<div className="flex flex-col gap-3">
					<input
						type="tel"
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.target.value)}
						placeholder="+1 (555) 555-5555"
						className="bg-zinc-800 border border-zinc-700 text-white p-3 rounded-md"
					/>
					<Button 
						onClick={startPhoneSignIn} 
						disabled={status === "sending"}
						className="bg-green-500 hover:bg-green-400 text-black rounded-full py-6 font-medium"
					>
						{status === "sending" ? "Sending..." : "Send Verification Code"}
					</Button>
				</div>
			) : (
				<Button 
					onClick={() => setIsPhoneSignInStarted(true)} 
					variant="outline" 
					className="bg-transparent border-zinc-700 hover:bg-zinc-800 text-white rounded-full py-6 font-medium flex gap-3 items-center justify-center"
				>
					<Smartphone className="size-5" />
					<span>Continue with phone number</span>
				</Button>
			)}
		</div>
	);
};

export default SignInOAuthButtons;