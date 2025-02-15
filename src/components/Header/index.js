import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import { useTheme } from "../../utils/ThemeContext";
import { BsSun, BsMoonStars } from "react-icons/bs";
import { BiHome } from "react-icons/bi";
import { WiDayThunderstorm, WiDaySunny } from "react-icons/wi";
import { MdAir } from "react-icons/md";
import { useTranslation } from "react-i18next";

const cx = classNames.bind(styles);

function Header() {
	const { isDarkMode, toggleTheme } = useTheme();
	const [hoveredIndex, setHoveredIndex] = useState(null);
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();

	const toggleLanguage = () => {
		const newLang = i18n.language === "en" ? "vi" : "en";
		i18n.changeLanguage(newLang);
		window.dispatchEvent(new CustomEvent("languageChange", { detail: newLang }));
	};

	const handleLogoClick = () => {
		navigate("/");
	};

	const menuItems = [
		{
			path: "/",
			icon: <BiHome />,
			label: t("header.home"),
			exact: true,
		},
		{
			path: "/world-air-quality-ranking",
			icon: <MdAir />,
			label: t("header.airQuality"),
		},
		{
			path: "/storm-and-hydrometeorological-forecasting",
			icon: <WiDayThunderstorm />,
			label: t("header.storm"),
		},
	];

	return (
		<header className={cx("header")}>
			<div className={cx("container")}>
				<div className={cx("logo-section")} onClick={handleLogoClick}>
					<WiDaySunny className={cx("logo")} />
					<span className={cx("brand-name")}>XWeather</span>
				</div>

				<nav className={cx("navigation")}>
					{menuItems.map((item, index) => (
						<div
							key={item.path}
							className={cx("nav-link", {
								active: location.pathname === item.path,
								hovered: hoveredIndex === index,
								"before-hovered": index < hoveredIndex,
								"after-hovered": index > hoveredIndex,
							})}
							onClick={() => navigate(item.path)}
							onMouseEnter={() => setHoveredIndex(index)}
							onMouseLeave={() => setHoveredIndex(null)}
						>
							<span className={cx("nav-icon")}>{item.icon}</span>
							<span className={cx("nav-label")}>{item.label}</span>
						</div>
					))}
				</nav>

				<div className={cx("left-section")}>
					<button
						className={cx("theme-toggle", { active: isDarkMode })}
						onClick={toggleTheme}
					>
						<span className={cx("toggle-slider")}>
							{isDarkMode ? <BsMoonStars /> : <BsSun />}
						</span>
					</button>
					<button
						className={cx("lang-toggle", { active: i18n.language === "vi" })}
						onClick={toggleLanguage}
					>
						<span className={cx("toggle-slider")}>
							{i18n.language === "en" ? "EN" : "VI"}
						</span>
					</button>
				</div>
			</div>
		</header>
	);
}

export default Header;
