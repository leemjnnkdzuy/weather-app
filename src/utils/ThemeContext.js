import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const saved = localStorage.getItem("theme");
		if (saved) {
			return saved === "dark";
		}
		return true;
	});

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", "dark");
		localStorage.setItem("theme", "dark");
	}, []);

	useEffect(() => {
		localStorage.setItem("theme", isDarkMode ? "dark" : "light");
		document.documentElement.setAttribute(
			"data-theme",
			isDarkMode ? "dark" : "light"
		);
	}, [isDarkMode]);

	const toggleTheme = () => {
		setIsDarkMode((prev) => !prev);
	};

	return (
		<ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
