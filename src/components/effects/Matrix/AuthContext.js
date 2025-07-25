// Third-party imports
import React, { createContext, useContext, useState } from "react";

// Asset imports
import incorrectAudio from "../../../assets/audio/didn't-say-the-magic-word.mp3";

const AuthContext = createContext();

// Secure password validation using environment variable
const getSecurePassword = () => {
	// Use environment variable for password, fallback to a more secure default
	const envPassword = process.env.REACT_APP_AUTH_PASSWORD;
	if (envPassword) {
		return envPassword.toLowerCase();
	}
	// In production, this should always be set via environment variable
	console.warn("REACT_APP_AUTH_PASSWORD not set, using fallback");
	return "aaron";
};

export const AuthProvider = ({ children }) => {
	const [isUnlocked, setIsUnlocked] = useState(() => {
		// Check URL parameters on initial load
		const urlParams = new URLSearchParams(window.location.search);
		const passwordParam = urlParams.get("password");
		const securePassword = getSecurePassword();
		return passwordParam?.toLowerCase() === securePassword;
	});
	const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);
	const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);
	const audioRef = React.useRef(null);

	const dismissFeedback = () => {
		setShowIncorrectFeedback(false);
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
		}
	};

	const checkPassword = (password) => {
		const securePassword = getSecurePassword();
		if (password.toLowerCase() === securePassword) {
			setIsUnlocked(true);
			setShowSuccessFeedback(true);
			setTimeout(() => setShowSuccessFeedback(false), 2000);
			return true;
		}

		setShowIncorrectFeedback(true);
		if (audioRef.current) {
			audioRef.current.currentTime = 0;
			audioRef.current.loop = true;
			const playPromise = audioRef.current.play();
			if (playPromise !== undefined) {
				playPromise.catch((error) => {
					// * Playback was interrupted or failed.
					// * This is normal if the user dismissed the feedback quickly.
					// * Optionally, log or handle the error here if needed.
				});
			}
		}
		return false;
	};

	return (
		<AuthContext.Provider
			value={{
				isUnlocked,
				checkPassword,
				showIncorrectFeedback,
				showSuccessFeedback,
				dismissFeedback,
			}}
		>
			<audio ref={audioRef} src={incorrectAudio} style={{ display: "none" }}>
				<track kind="captions" srcLang="en" label="English" />
			</audio>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
