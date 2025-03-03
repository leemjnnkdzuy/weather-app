import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";
import styles from "./HourlyForecast.module.scss";
import {
	WiThermometer,
	WiBarometer,
	WiHumidity,
	WiStrongWind,
	WiWindDeg
} from "react-icons/wi";
import {
	getWeatherIcon,
	getAQIClassName,
	formatDay,
	formatDate,
} from "../../utils/formatters";

const cx = classNames.bind(styles);

function HourlyForecast({ hourlyData }) {
	const { t, i18n } = useTranslation();

	useEffect(() => {
		const wheelOpts = { passive: false };
		const forecastElement = document.querySelector(`.${cx("hourly-forecast")}`);

		const handleWheelEvent = (event) => {
			const isHorizontalScroll = Math.abs(event.deltaX) > Math.abs(event.deltaY);
			if (!isHorizontalScroll) {
				event.currentTarget.scrollLeft += event.deltaY;
				if (
					(event.currentTarget.scrollLeft === 0 && event.deltaY < 0) ||
					(event.currentTarget.scrollLeft >=
						event.currentTarget.scrollWidth - event.currentTarget.clientWidth &&
						event.deltaY > 0)
				) {
					return;
				}
				event.preventDefault();
			}
		};

		if (forecastElement) {
			forecastElement.addEventListener("wheel", handleWheelEvent, wheelOpts);
		}

		return () => {
			if (forecastElement) {
				forecastElement.removeEventListener("wheel", handleWheelEvent, wheelOpts);
			}
		};
	}, []);

	return (
		<div className={cx("hourly-container")}>
			<div className={cx("header")}>
				<h3>{t("airQualityRanking.forecast.hourly")}</h3>
				<p className={cx("description")}>
					{t("airQualityRanking.forecast.hourlyDescription")}
				</p>
			</div>
			<div className={cx("hourly-forecast")}>
				{hourlyData.map((hour, index) => (
					<div key={index} className={cx("forecast-hour")}>
						<div className={cx("date")}>
							<span className={cx("day-name")}>{formatDay(hour.ts, t)}</span>
							<span className={cx("date-num")}>{formatDate(hour.ts, i18n.language)}</span>
						</div>
						<div className={cx("hour-time")}>{new Date(hour.ts).getHours()}:00</div>
						<div className={cx("weather-icon")}>
							{getWeatherIcon(hour.condition, hour.icon)}
						</div>
						<div className={cx("weather-details")}>
							<div className={cx("detail-item")}>
								<WiThermometer />
								<span>{hour.temperature}°C</span>
							</div>
							<div className={cx("detail-item")}>
								<WiBarometer />
								<span>{hour.pressure}</span>
							</div>
							<div className={cx("detail-item")}>
								<WiHumidity />
								<span>{hour.humidity}%</span>
							</div>
							<div className={cx("detail-item")}>
								<WiStrongWind />
								<span>{hour.wind.speed}m/s</span>
							</div>
							<div className={cx("detail-item")}>
								<WiWindDeg style={{ transform: `rotate(${hour.wind.direction}deg)` }} />
								<span>{hour.wind.direction}°</span>
							</div>
						</div>
						<div className={cx("aqi-badge", getAQIClassName(hour.aqi))}>
							<span>AQI</span>
							<strong>{hour.aqi}</strong>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default HourlyForecast;
