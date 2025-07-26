// Third-party imports
import React, { useState, useEffect, useCallback } from "react";
import { Link } from 'react-router-dom';
import { useScrollThreshold } from "../../../hooks/useScrollThreshold";

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

function NavBar({ items, onMatrixActivate, onShopActivate, isInShop = false }) {
	const showScrollTop = useScrollThreshold(300, 100);
	const [themeClicks, setThemeClicks] = useState([]);
	const [isLightTheme, setIsLightTheme] = useState(getInitialTheme);
	const { isUnlocked } = useAuth();

	// Create navItems conditionally
	let navItems = { ...items };

	if (isInShop) {
		navItems = {
			Home: '/',
			Shop: '/#shop'
		};
	} else if (isUnlocked) {
		navItems.Shop = '/#shop';
	}

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
		const { body } = document;
		body.classList.toggle(THEME.CLASS_NAME, isLightTheme);
		updateThemeColor(isLightTheme);
	}, [isLightTheme]);

	const links = Object.keys(navItems)
		.reverse()
		.map((key) => (
			<li key={key} className="navbar__item">
				<Link
					to={isInShop && key === 'Home' ? '/' : navItems[key]}
					onClick={(event) => {
						if (key === 'Shop' && onShopActivate) {
							event.preventDefault();
							onShopActivate();
							return;
						}
						// Rest of click handler for scrolling if needed
					}}
				>
					{key}
				</Link>
			</li>
		));

	return (
		<nav className="navbar">
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
		</nav>
	);
}

export default NavBar;
