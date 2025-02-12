import React from "react";
import classNames from "classnames/bind";
import styles from "./DefaultLayout.module.scss";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { useTheme } from "../../utils/ThemeContext";

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
	const { isDarkMode } = useTheme();

	return (
		<div className={cx("app-container", { dark: isDarkMode, light: !isDarkMode })}>
			<Header />
			<Sidebar />
			<div className={cx("main-container")}>
				<div className={cx("content")}>{children}</div>
			</div>
		</div>
	);
}

export default DefaultLayout;
