// Third-party imports
import React, { createContext, useContext, useState } from "react";

// Asset imports
import incorrectAudio from "../../../assets/audio/didn't-say-the-magic-word.mp3";

const AuthContext = createContext();

// Simple hash function for password comparison (in production, use proper hashing)
const hashPassword = (password) => {
	let hash = 0;
	for (let i = 0; i < password.length; i++) {
		const char = password.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32-bit integer
	}
	return hash.toString();
};

export const AuthProvider = ({ children }) => {
	const [isUnlocked, setIsUnlocked] = useState(() => {
		// Check URL parameters on initial load
		const urlParams = new URLSearchParams(window.location.search);
		const passwordParam = urlParams.get("password");
		// Use environment variable or fallback to a hashed version
		const expectedHash = process.env.REACT_APP_PASSWORD_HASH || "123456789"; // Default hash for "aaron"
		return passwordParam && hashPassword(passwordParam.toLowerCase()) === expectedHash;
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
		// Use environment variable or fallback to a hashed version
		const expectedHash = process.env.REACT_APP_PASSWORD_HASH || "123456789"; // Default hash for "aaron"
		if (hashPassword(password.toLowerCase()) === expectedHash) {
			setIsUnlocked(true);
			setShowSuccessFeedback(true);
			setTimeout(() => setShowSuccessFeedback(false), 2000);
			return true;
		}

		setShowIncorrectFeedback(true);
		if (audioRef.current) {
			audioRef.current.currentTime = 0;
			audioRef.current.loop = true;
			audioRef.current.play();
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
