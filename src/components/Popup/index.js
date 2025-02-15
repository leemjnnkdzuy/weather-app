import React, { useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Popup.module.scss";
import { useTheme } from "../../utils/ThemeContext";

const cx = classNames.bind(styles);

const icons = {
	error: (
		<svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
			<path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
			<path d="M464 688a48 48 0 1096 0 48 48 0 10-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z" />
		</svg>
	),
	success: (
		<svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
			<path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8l157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z" />
		</svg>
	),
};

function Popup({ message, type = "error", onClose, duration = 3000 }) {
	const { isDarkMode } = useTheme();

	useEffect(() => {
		if (duration) {
			const timer = setTimeout(() => {
				onClose();
			}, duration);
			return () => clearTimeout(timer);
		}
	}, [duration, onClose]);

	return (
		<div className={cx("popup-container")}>
			<div className={cx("popup-overlay")} onClick={onClose}></div>
			<div
				className={cx("popup", type)}
				onClick={(e) => e.stopPropagation()}
				data-theme={isDarkMode ? "dark" : "light"}
			>
				<div className={cx("icon")}>{icons[type]}</div>
				<p className={cx("message")}>{message}</p>
				<button className={cx("close-button")} onClick={onClose}>
					<svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
						<path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />
					</svg>
				</button>
			</div>
		</div>
	);
}

export default Popup;
