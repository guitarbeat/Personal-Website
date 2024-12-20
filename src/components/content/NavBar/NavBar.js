// Third-party imports
import React, { useState, useEffect } from "react";

// Context imports
import { useAuth } from "../../effects/Matrix/AuthContext";

function NavBar({ items, onMatrixActivate }) {
	const [showScrollTop, setShowScrollTop] = useState(false);
	const [themeClicks, setThemeClicks] = useState([]);
	const SCROLL_THRESHOLD = 300; // Show button after scrolling 300px
	const MATRIX_CLICKS = 5;
	const CLICK_TIMEOUT = 2000; // 2 seconds
	const { isUnlocked } = useAuth();

	// Add Tools to nav items when unlocked
	const navItems = {
		...items,
		...(isUnlocked && { Tools: "/#tools" }),
	};

	useEffect(() => {
		const checkScroll = () => {
			setShowScrollTop(window.scrollY > SCROLL_THRESHOLD);
		};

		// Check initial scroll position
		checkScroll();

		// Add scroll listener with throttling
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

		// Cleanup
		return () => {
			window.removeEventListener("scroll", throttledCheckScroll);
			if (timeoutId) {
     clearTimeout(timeoutId);
   }
		};
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const handleThemeClick = () => {
		const now = Date.now();
		const newClicks = [...themeClicks, now].filter(
			(click) => now - click < CLICK_TIMEOUT,
		);
		setThemeClicks(newClicks);

		if (newClicks.length >= MATRIX_CLICKS) {
			setThemeClicks([]); // Reset clicks
			if (onMatrixActivate) {
				onMatrixActivate();
			}
		}
	};

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
					className="theme-switch"
					onClick={handleThemeClick}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							handleThemeClick();
						}
					}}
					tabIndex={0}
					aria-label="Toggle theme"
					type="button" // Added type prop
				>
					<div className="switch" />
				</button>
			{/* Always render the button, but control visibility with CSS */}
			<button
				type="button" // Added type prop
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
