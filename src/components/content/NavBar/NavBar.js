// Third-party imports
import React, { useState, useEffect, useCallback } from "react";

// Context imports
import { useAuth } from "../../effects/Matrix/AuthContext";

// Theme Configuration
const THEME = {
	LIGHT: "light",
	DARK: "dark",
	STORAGE_KEY: "theme",
	CLASS_NAME: "light-theme",
};

// Utility functions
const scrollToTop = () => {
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
};

const getInitialTheme = () => {
	const savedTheme = localStorage.getItem(THEME.STORAGE_KEY);
	if (savedTheme) {
		return savedTheme === THEME.LIGHT;
	}
	return window.matchMedia("(prefers-color-scheme: light)").matches;
};

const updateThemeColor = (isLight) => {
	const themeColorMeta = document.querySelector("meta#theme-color");
	if (themeColorMeta) {
		themeColorMeta.content = isLight ? "#ffffff" : "#1a1a1a";
	}
};

function NavBar({ items, onMatrixActivate }) {
	const [showScrollTop, setShowScrollTop] = useState(false);
	const [themeClicks, setThemeClicks] = useState([]);
	const [isLightTheme, setIsLightTheme] = useState(getInitialTheme);
	const { isUnlocked } = useAuth();

	const navItems = {
		...items,
		...(isUnlocked && { Tools: "/#tools" }),
	};

	const handleThemeClick = useCallback(() => {
		const now = Date.now();
		const newClicks = [...themeClicks, now].filter(
			(click) => now - click < 2000,
		);
		setThemeClicks(newClicks);

		if (newClicks.length >= 5) {
			setThemeClicks([]);
			if (onMatrixActivate) {
				onMatrixActivate();
			}
		}

		setIsLightTheme((prev) => {
			const newTheme = !prev;
			localStorage.setItem(
				THEME.STORAGE_KEY,
				newTheme ? THEME.LIGHT : THEME.DARK,
			);
			return newTheme;
		});
	}, [themeClicks, onMatrixActivate]);

	useEffect(() => {
		const checkScroll = () => {
			setShowScrollTop(window.scrollY > 300);
		};

		checkScroll();

		let timeoutId = null;
		const throttledCheckScroll = () => {
			if (timeoutId === null) {
				timeoutId = setTimeout(() => {
					checkScroll();
					timeoutId = null;
				}, 100);
			}
		};

		window.addEventListener("scroll", throttledCheckScroll);

		return () => {
			window.removeEventListener("scroll", throttledCheckScroll);
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, []);

	useEffect(() => {
		const {body} = document;
		body.classList.toggle(THEME.CLASS_NAME, isLightTheme);
		updateThemeColor(isLightTheme);
	}, [isLightTheme]);

	const links = Object.keys(navItems)
		.reverse()
		.map((key) => (
			<li key={key} className="navbar__item">
				<a
					href={navItems[key]}
					onClick={(event) => {
						event.preventDefault();
						const { href } = event.target;
						if (href.startsWith("#")) {
							window.location.href = `${window.location.origin}${href}`;
						} else {
							window.location.href = href;
						}
					}}
				>
					{key}
				</a>
			</li>
		));

	return (
		<ul className="navbar">
			{links}
			<button
				className={`theme-switch ${isLightTheme ? "light-theme" : ""}`}
				onClick={handleThemeClick}
				role="switch"
				aria-checked={isLightTheme}
				aria-label={`Switch to ${isLightTheme ? "dark" : "light"} theme`}
				type="button"
			>
				<div className="switch-handle">
					<div className="moon-phase-container" />
				</div>
			</button>
			<button
				type="button"
				className={`scroll-to-top ${showScrollTop ? "visible" : ""}`}
				onClick={scrollToTop}
				aria-label="Scroll to top"
				aria-hidden={!showScrollTop}
			>
				↑
			</button>
		</ul>
	);
}

export default NavBar;
