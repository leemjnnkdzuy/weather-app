import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import Assets from "../../assets";
import styles from "./NotificationBanner.module.scss";

const cx = classNames.bind(styles);

const NotificationBanner = ({ message, type = "info" }) => {
	const [raindrops, setRaindrops] = useState([]);

	useEffect(() => {
		const drops = [...Array(20)].map(() => ({
			left: Math.random() * 100,
			animationDuration: `${Math.random() * 0.3 + 0.7}s`,
			animationDelay: `${Math.random() * 1.5}s`,
		}));
		setRaindrops(drops);
	}, []);

	return (
		<div className={cx("banner")}>
			<div className={cx("cloud")}>
				<img src={Assets.white_3d_clouds} alt="Cloud" className={cx("cloud-image")} />
				<div className={cx("rain-container")}>
					{raindrops.map((drop, index) => (
						<span
							key={index}
							className={cx("raindrop")}
							style={{
								left: `${drop.left}%`,
								animationDuration: drop.animationDuration,
								animationDelay: drop.animationDelay,
							}}
						/>
					))}
				</div>
			</div>

			<div className={cx("content")}>
				<div className={cx("traffic-light")}>
					<div className={cx("light", { error: type === "error" })} />
					<div className={cx("light", { warning: type === "warning" })} />
					<div className={cx("light", { info: type === "info" })} />
				</div>
				{message}
			</div>
		</div>
	);
};

NotificationBanner.propTypes = {
	message: PropTypes.string.isRequired,
	type: PropTypes.oneOf(["info", "warning", "error"]),
};

export default NotificationBanner;
