import React from "react";
import classNames from "classnames/bind";
import { useTheme } from "../../utils/ThemeContext";
import styles from "./NoHeaderLayout.module.scss";

const cx = classNames.bind(styles);

function NoHeaderLayout({ children }) {
	const { isDarkMode } = useTheme();

	return (
		<div className={cx("wrapper", { dark: isDarkMode, light: !isDarkMode })}>
			<div className={cx("container")}>{children}</div>
		</div>
	);
}

export default NoHeaderLayout;
