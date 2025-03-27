// PlaybackControls.tsx
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUser } from "@clerk/clerk-react";
import ImprovedAdPopup from "@/components/AdPopup";
import { Musicinfo } from "@/components/MusicInfo";
import { PlaybackButtons } from "@/components/PlaybackButtons";
import { ProgressBar } from "@/components/ProgressBar";
import { PlaybackVolumeControls } from "@/layout/components/PlaybackVolumeControls";

export const PlaybackControls = () => {
	// Hook declarations (always call hooks unconditionally)
	const { currentSong, isPlaying, togglePlay, playNext, playPrevious } = usePlayerStore();
	const { isPro } = useAuthStore();
	const { user } = useUser();
	const [, setPlayCount] = useState(0);
	const [showAd, setShowAd] = useState(false);
	const prevSongRef = useRef<string | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [isRepeatOn, setIsRepeatOn] = useState(false);

	// Effect: Increase playCount when a new song starts (only if user is logged in)
	useEffect(() => {
		if (!user) return;
		if (currentSong && currentSong._id !== prevSongRef.current) {
			prevSongRef.current = currentSong._id;
			if (!isPro) {
				setPlayCount((prev) => {
					const newCount = prev + 1;
					if (newCount % 5 === 0) {
						setShowAd(true);
					}
					return newCount;
				});
			}
		}
	}, [currentSong, isPro, user]);

	// Effect: Setup audio event listeners
	useEffect(() => {
		audioRef.current = document.querySelector("audio");
		const audio = audioRef.current;
		if (!audio) return;

		const updateTime = () => setCurrentTime(audio.currentTime);
		const updateDuration = () => setDuration(audio.duration);
		const handleEnded = () => {
			if (isRepeatOn) {
				audio.currentTime = 0;
				audio.play();
			} else {
				usePlayerStore.setState({ isPlaying: false });
				playNext();
			}
		};

		audio.addEventListener("timeupdate", updateTime);
		audio.addEventListener("loadedmetadata", updateDuration);
		audio.addEventListener("ended", handleEnded);

		return () => {
			audio.removeEventListener("timeupdate", updateTime);
			audio.removeEventListener("loadedmetadata", updateDuration);
			audio.removeEventListener("ended", handleEnded);
		};
	}, [currentSong, isRepeatOn, playNext]);

	// If no user, render a minimal footer
	if (!user) {
		return (
			<footer className="h-20 bg-gradient-to-b from-zinc-900 to-black border-t border-zinc-800/40 px-4 sticky bottom-0">
				<div className="flex justify-center items-center h-full">
					<p className="text-zinc-400 text-sm">Please log in to play songs</p>
				</div>
			</footer>
		);
	}

	const handleNextAd = () => {
		if (audioRef.current && isPlaying) {
			audioRef.current.pause();
			usePlayerStore.setState({ isPlaying: false });
		}
	};

	const handleCloseAd = () => {
		setShowAd(false);
		if (audioRef.current && currentSong) {
			audioRef.current.play();
			usePlayerStore.setState({ isPlaying: true });
		}
	};

	const handleSeek = (value: number[]) => {
		if (audioRef.current) {
			audioRef.current.currentTime = value[0];
		}
	};

	return (
		<>
			<footer className='h-20 sm:h-24 bg-gradient-to-b from-zinc-900 to-black border-t border-zinc-800/40 px-4 sticky bottom-0'>
				<div className='flex justify-between items-center h-full max-w-[1800px] mx-auto'>
					{/* Currently playing song */}
					<Musicinfo currentSong={currentSong} />

					{/* Player controls */}
					<div className='flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]'>
						<PlaybackButtons 
							isPlaying={isPlaying}
							currentSong={currentSong}
							togglePlay={togglePlay}
							playNext={playNext}
							playPrevious={playPrevious}
							isRepeatOn={isRepeatOn}
							setIsRepeatOn={setIsRepeatOn}
						/>

						<ProgressBar 
							currentTime={currentTime}
							duration={duration}
							onSeek={handleSeek}
						/>
					</div>

					{/* Volume controls */}
					<PlaybackVolumeControls audioRef={audioRef} />
				</div>
			</footer>
			
			{/* Advertisement popup */}
			{showAd && (
				<ImprovedAdPopup 
					onClose={handleCloseAd} 
					onNextAd={handleNextAd}
				/>
			)}
		</>
	);
};