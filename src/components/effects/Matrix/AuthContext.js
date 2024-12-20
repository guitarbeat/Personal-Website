// Third-party imports
import React, { createContext, useContext, useState } from "react";

// Asset imports
import incorrectAudio from "../../../assets/audio/didn't-say-the-magic-word.mp3";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isUnlocked, setIsUnlocked] = useState(() => {
		// Check URL parameters on initial load
		const urlParams = new URLSearchParams(window.location.search);
		const passwordParam = urlParams.get("password");
		return passwordParam?.toLowerCase() === "aaron";
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
		if (password.toLowerCase() === "aaron") {
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
