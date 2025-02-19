import {
	WiThermometer,
	WiCloudy,
	WiHumidity,
	WiStrongWind,
	WiWindDeg,
} from "react-icons/wi";
import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";
import styles from "./LocationInfo.module.scss";
import { getAQIClassName, getAQIStatus } from "../../utils/formatters";

const cx = classNames.bind(styles);

function LocationInfo({ cityData }) {
	const { t, i18n } = useTranslation();

	const weatherItems = [
	{
		icon: <WiThermometer className={cx("weather-icon")} size={45} />,
		label: t("home.weatherInfo.temperature"),
		value: `${cityData.current.temperature}°C`,
	},
	{
		icon: <WiHumidity className={cx("weather-icon")} size={45} />,
		label: t("home.weatherInfo.humidity"),
		value: `${cityData.current.humidity}%`,
	},
	{
		icon: <WiStrongWind className={cx("weather-icon")} size={45} />,
		label: t("home.weatherInfo.windSpeed"),
		value: `${cityData.current.wind.speed} m/s`,
	},
	{
		icon: <WiWindDeg className={cx("weather-icon")} size={45} />,
		label: t("home.weatherDetails.wind.direction"),
		value: `${cityData.current.wind.direction}°`,
	},
	{
		icon: <WiCloudy className={cx("weather-icon")} size={45} />,
		label: t("home.weatherDetails.atmosphere.clouds"),
		value: cityData.current.condition,
	},
];

	return (
		<div className={cx("location-info", getAQIClassName(cityData.current.aqi))}>
			<div className={cx("location-header")}>
				<div className={cx("location-name")}>
					<h2>{cityData.name}</h2>
					<span>
						{cityData.state}, {cityData.country}
					</span>
				</div>
				<div className={cx("aqi-status-wrapper")}>
					<div className={cx("quality-status")}>
						<span className={cx("status-label")}>{t("airQualityRanking.status")}</span>
						<span className={cx("status-value")}>
							{t(`airQualityRanking.quality.${getAQIStatus(cityData.current.aqi)}`)}
						</span>
					</div>
					<div className={cx("aqi-badge")}>
						<span className={cx("aqi-number")}>{cityData.current.aqi}</span>
						<span className={cx("aqi-text")}>AQI</span>
					</div>
				</div>
			</div>
			<div className={cx("location-details")}>
				<div className={cx("coordinates")}>
					<i className="fas fa-map-marker-alt"></i>
					<span>
						{t("home.weatherDetails.location")}: {cityData.coordinates.latitude}°N,{" "}
						{cityData.coordinates.longitude}°E
					</span>
				</div>
				<div className={cx("current-time")}>
					<i className="far fa-clock"></i>
					<span>{new Date(cityData.current.ts).toLocaleString(i18n.language)}</span>
				</div>
			</div>
			<div className={cx("weather-section")}>
				{weatherItems.map((item, index) => (
					<div
						key={index}
						className={cx("weather-item", {
							"center-item":
								index === weatherItems.length - 1 && weatherItems.length % 2 !== 0,
						})}
					>
						{item.icon}
						<div className={cx("weather-info")}>
							<span className={cx("label")}>{item.label}</span>
							<span className={cx("value")}>{item.value}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default LocationInfo;
