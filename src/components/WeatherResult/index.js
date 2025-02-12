import React from "react";
import { useTranslation } from "react-i18next";
import {
	WiThermometer,
	WiStrongWind,
	WiSunrise,
	WiCloudy,
	WiDaySunny,
	WiRain,
	WiSnow,
	WiThunderstorm,
} from "react-icons/wi";
import classNames from "classnames/bind";
import styles from "./WeatherResult.module.scss";

const cx = classNames.bind(styles);

const WeatherResult = ({ weatherData, loading }) => {
	const { t } = useTranslation();

	const getWeatherIcon = (weatherCode) => {
		if (!weatherCode) return <WiDaySunny />;
		if (weatherCode >= 200 && weatherCode < 300) return <WiThunderstorm />;
		if (weatherCode >= 300 && weatherCode < 600) return <WiRain />;
		if (weatherCode >= 600 && weatherCode < 700) return <WiSnow />;
		if (weatherCode >= 700 && weatherCode < 800) return <WiCloudy />;
		if (weatherCode === 800) return <WiDaySunny />;
		return <WiCloudy />;
	};

	const formatTime = (timestamp) => {
		return new Date(timestamp * 1000).toLocaleTimeString();
	};

	const WeatherDescription = () => (
		<div className={cx("description")}>
			{loading ? (
				<span className={cx("loading-text")}>...</span>
			) : (
				weatherData.weather[0].description
			)}
		</div>
	);

	return (
	<div className={cx("weather-result")}>
		<div className={cx("weather-main")}>
			{getWeatherIcon(weatherData.weather[0].id)}
			<div className={cx("temperature")}>{Math.round(weatherData.main.temp)}°C</div>
			<WeatherDescription />
			<div className={cx("location")}>
				{weatherData.name}, {weatherData.sys.country}
			</div>
		</div>

		<div className={cx("weather-details-grid")}>
			<div className={cx("detail-card")}>
				<div className={cx("detail-info")}>
					<span>
						<WiThermometer />
						{t("home.weatherDetails.temperature.title")}
					</span>
					<div>
						<div>
							{t("home.weatherDetails.temperature.current")}: {weatherData.main.temp}°C
						</div>
						<div>
							{t("home.weatherDetails.temperature.feelsLike")}: {weatherData.main.feels_like}
							°C
						</div>
						<div>
							{t("home.weatherDetails.temperature.min")}: {weatherData.main.temp_min}°C
						</div>
						<div>
							{t("home.weatherDetails.temperature.max")}: {weatherData.main.temp_max}°C
						</div>
					</div>
				</div>
			</div>

			<div className={cx("detail-card")}>
				<div className={cx("detail-info")}>
					<span>
						<WiCloudy />
						{t("home.weatherDetails.atmosphere.title")}
					</span>
					<div>
						<div>
							{t("home.weatherDetails.atmosphere.clouds")}: {weatherData.clouds.all}%
						</div>
						<div>
							{t("home.weatherDetails.atmosphere.humidity")}: {weatherData.main.humidity}%
						</div>
						<div>
							{t("home.weatherDetails.atmosphere.pressure")}: {weatherData.main.pressure} hPa
						</div>
						<div>
							{t("home.weatherDetails.atmosphere.visibility")}:{" "}
							{weatherData.visibility / 1000} km
						</div>
					</div>
				</div>
			</div>

			<div className={cx("detail-card")}>
				<div className={cx("detail-info")}>
					<span>
						<WiStrongWind />
						{t("home.weatherDetails.wind.title")}
					</span>
					<div>
						<div>
							{t("home.weatherDetails.wind.speed")}: {weatherData.wind.speed} m/s
						</div>
						<div>
							{t("home.weatherDetails.wind.direction")}: {weatherData.wind.deg}°
						</div>
						{weatherData.wind.gust && (
							<div>
								{t("home.weatherDetails.wind.gust")}: {weatherData.wind.gust} m/s
							</div>
						)}
					</div>
				</div>
			</div>

			<div className={cx("detail-card")}>
				<div className={cx("detail-info")}>
					<span>
						<WiSunrise />
						{t("home.weatherDetails.sun.title")}
					</span>
					<div>
						<div>
							{t("home.weatherDetails.sun.sunrise")}: {formatTime(weatherData.sys.sunrise)}
						</div>
						<div>
							{t("home.weatherDetails.sun.sunset")}: {formatTime(weatherData.sys.sunset)}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
);
};

export default WeatherResult;
