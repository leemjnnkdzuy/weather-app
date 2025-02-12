import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../utils/ThemeContext";
import classNames from "classnames/bind";
import { HiMenuAlt2 } from "react-icons/hi";
import { BiHome } from "react-icons/bi";
import { WiDayThunderstorm, WiDaySunny } from "react-icons/wi";
import { MdAir } from "react-icons/md";
import { BsSun, BsMoonStars } from "react-icons/bs";
import styles from "./Sidebar.module.scss";

const cx = classNames.bind(styles);

function Sidebar() {
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();
	const { isDarkMode, toggleTheme } = useTheme();
	const [isOpen, setIsOpen] = useState(false);

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

	const toggleSidebar = () => {
		setIsOpen(!isOpen);
	};

	const handleNavigate = (path) => {
		navigate(path);
		setIsOpen(false);
	};

	return (
		<>
			<button className={cx("toggle-button")} onClick={toggleSidebar}>
				<HiMenuAlt2 />
			</button>
			<div className={cx("sidebar", { open: isOpen })}>
				<div className={cx("sidebar-header")}>
					<div className={cx("logo-section")} onClick={() => handleNavigate("/")}>
						<WiDaySunny className={cx("logo")} />
						<span className={cx("brand-name")}>XWeather</span>
					</div>
				</div>

				<nav className={cx("nav")}>
					{menuItems.map((item) => (
						<div
							key={item.path}
							className={cx("nav-item", { active: location.pathname === item.path })}
							onClick={() => handleNavigate(item.path)}
						>
							<span className={cx("icon")}>{item.icon}</span>
							<span className={cx("label")}>{item.label}</span>
						</div>
					))}
				</nav>

				<div className={cx("bottom-controls")}>
					<div className={cx("control-group")}>
						<div className={cx("control-label")}>{t("settings.theme")}</div>
						<button
							className={cx("ios-toggle", { active: isDarkMode })}
							onClick={toggleTheme}
						>
							<span className={cx("toggle-slider")}>
								{isDarkMode ? <BsMoonStars /> : <BsSun />}
							</span>
						</button>
					</div>
					<div className={cx("control-group")}>
						<div className={cx("control-label")}>{t("settings.language")}</div>
						<button
							className={cx("ios-toggle", { active: i18n.language === "vi" })}
							onClick={() => i18n.changeLanguage(i18n.language === "en" ? "vi" : "en")}
						>
							<span className={cx("toggle-slider")}>
								{i18n.language === "en" ? "EN" : "VI"}
							</span>
						</button>
					</div>
				</div>
			</div>
			{isOpen && <div className={cx("overlay")} onClick={toggleSidebar} />}
		</>
	);
}

export default Sidebar;
