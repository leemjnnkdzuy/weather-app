import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { airQualityService } from "../../utils/request";
import classNames from "classnames/bind";
import styles from "./AirQualityPages.module.scss";
import {
	WiThermometer,
	WiCloudy,
	WiHumidity,
	WiStrongWind,
	WiWindDeg,
	WiBarometer,
	WiDaySunny,
	WiNightClear,
	WiDayCloudy,
	WiNightCloudy,
	WiRain,
	WiDayFog,
	WiNightFog,
} from "react-icons/wi";
import { formatPollutantName } from "../../utils/formatters";

const cx = classNames.bind(styles);

const getAQIStatus = (aqi) => {
	if (aqi <= 50) return "good";
	if (aqi <= 100) return "moderate";
	if (aqi <= 150) return "unhealthySensitive";
	if (aqi <= 200) return "unhealthy";
	if (aqi <= 300) return "veryUnhealthy";
	return "hazardous";
};

function AirQualityPages() {
	const { cityId } = useParams();
	const { t, i18n } = useTranslation();
	const [cityData, setCityData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCityData = async () => {
			try {
				const data = await airQualityService.getCityDetails(cityId, i18n.language);
				setCityData(data);
			} catch (error) {
				console.error("Error fetching city details:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchCityData();
	}, [cityId, i18n.language]);

	const getAQIClassName = (aqi) => {
		if (aqi <= 50) return "good";
		if (aqi <= 100) return "moderate";
		if (aqi <= 150) return "sensitive";
		if (aqi <= 200) return "unhealthy";
		if (aqi <= 300) return "very-unhealthy";
		return "hazardous";
	};

	const getWeatherIcon = (condition, icon) => {
		const isNight = icon.includes("night");
		const iconSize = 80;
		switch (true) {
			case /quang|clear/.test(condition.toLowerCase()):
				return isNight ? (
					<WiNightClear size={iconSize} />
				) : (
					<WiDaySunny size={iconSize} />
				);
			case /mây rải rác|scattered/.test(condition.toLowerCase()):
				return isNight ? (
					<WiNightCloudy size={iconSize} />
				) : (
					<WiDayCloudy size={iconSize} />
				);
			case /mây|clouds|nhiều mây/.test(condition.toLowerCase()):
				return <WiCloudy size={iconSize} />;
			case /mưa|rain/.test(condition.toLowerCase()):
				return <WiRain size={iconSize} />;
			case /sương mù|mist|fog/.test(condition.toLowerCase()):
				return isNight ? <WiNightFog size={iconSize} /> : <WiDayFog size={iconSize} />;
			default:
				return <WiDaySunny size={iconSize} />;
		}
	};

	const handleWheel = (event) => {
		const container = event.currentTarget;
		const isHorizontalScroll = Math.abs(event.deltaX) > Math.abs(event.deltaY);

		if (!isHorizontalScroll) {
			container.scrollLeft += event.deltaY;
			if (
				(container.scrollLeft === 0 && event.deltaY < 0) ||
				(container.scrollLeft >= container.scrollWidth - container.clientWidth &&
					event.deltaY > 0)
			) {
				return;
			}
			event.preventDefault();
		}
	};

	useEffect(() => {
		document.body.style.overflow = "auto";
		return () => {
			document.body.style.overflow = "auto";
		};
	}, []);

	const renderLocationInfo = () => {
		const weatherItems = [
			{
				icon: <WiThermometer className={cx("weather-icon")} />,
				label: t("home.weatherInfo.temperature"),
				value: `${cityData.current.temperature}°C`,
			},
			{
				icon: <WiCloudy className={cx("weather-icon")} />,
				label: t("home.weatherDetails.atmosphere.clouds"),
				value: cityData.current.condition,
			},
			{
				icon: <WiHumidity className={cx("weather-icon")} />,
				label: t("home.weatherInfo.humidity"),
				value: `${cityData.current.humidity}%`,
			},
			{
				icon: <WiStrongWind className={cx("weather-icon")} />,
				label: t("home.weatherInfo.windSpeed"),
				value: `${cityData.current.wind.speed} m/s`,
			},
			{
				icon: <WiWindDeg className={cx("weather-icon")} />,
				label: t("home.weatherDetails.wind.direction"),
				value: `${cityData.current.wind.direction}°`,
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
	};

	const renderCurrentAirQuality = () => (
		<div className={cx("current-air-quality")}>
			<div className={cx("title-group")}>
				<h3 className={cx("section-title")}>
					{t("airQualityRanking.columns.pollutants.title")}
				</h3>
				<p className={cx("section-subtitle")}>
					{t("airQualityRanking.columns.pollutants.subtitle", { city: cityData.name })}
				</p>
			</div>
			<div className={cx("pollutants-list")}>
				{cityData.current.pollutants.map((pollutant, index) => (
					<div key={index} className={cx("pollutant-item")}>
						<h4>{formatPollutantName(pollutant.pollutantName)}</h4>

						<p>{pollutant.description}</p>
						<p>
							{t("airQualityRanking.columns.concentration")}: {pollutant.concentration}{" "}
							{pollutant.unit}
						</p>
					</div>
				))}
			</div>
		</div>
	);

	const renderHourlyForecast = () => (
		<div className={cx("hourly-forecast")} onWheel={handleWheel}>
			{cityData.forecasts.hourly.map((hour, index) => (
				<div key={index} className={cx("forecast-hour")}>
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
	);

	const renderDailyForecast = () => (
		<div className={cx("daily-forecast")}>
			<h3>{t("airQualityRanking.forecast.sevenDay")}</h3>
			<div className={cx("forecast-list")}>
				{cityData.forecasts.daily.map((day, index) => (
					<div key={index} className={cx("forecast-day")}>
						<p>{new Date(day.ts).toLocaleDateString()}</p>
						<p>AQI: {day.aqi}</p>
						<p>{day.condition}</p>
						<p>
							{day.temperature.min}°C - {day.temperature.max}°C
						</p>
					</div>
				))}
			</div>
		</div>
	);

	const renderRecommendations = () => (
		<div className={cx("recommendations")}>
			<div className={cx("recommendations-header")}>
				<h3 className={cx("recommendations-title")}>
					{t("airQualityRanking.recommendations.health")}
				</h3>
				<h3 className={cx("recommendations-subtitle")}>
					{t("airQualityRanking.recommendations.description")}
				</h3>
			</div>
			<div className={cx("recommendations-list")}>
				{Object.entries(cityData.recommendations.pollution).map(
					([key, value], index) => (
						<div key={key} className={cx("recommendation-item", value.value)}>
							<div className={cx("recommendation-number")}>{index + 1}</div>
							<p>{value.text}</p>
						</div>
					)
				)}
			</div>
		</div>
	);

	if (loading || !cityData) {
		return <div className={cx("loading")}></div>;
	}

	return (
		<div className={cx("container")}>
			<div className={cx("top-section")}>
				{renderLocationInfo()}
				{renderCurrentAirQuality()}
			</div>
			{renderHourlyForecast()}
			{renderDailyForecast()}
			{renderRecommendations()}
		</div>
	);
}

export default AirQualityPages;
