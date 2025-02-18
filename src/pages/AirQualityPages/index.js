import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { airQualityService } from "../../utils/request";
import classNames from "classnames/bind";
import styles from "./AirQualityPages.module.scss";
import LocationInfo from "../../components/LocationInfo";
import CurrentAirQuality from "../../components/CurrentAirQuality";
import { getAQIClassName } from "../../utils/formatters";
import HistoricalAirQuality from "../../components/HistoricalAirQuality";
import Recommendations from "../../components/Recommendations";
import HourlyForecast from "../../components/HourlyForecast";
import DailyForecast from "../../components/DailyForecast";

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

	useEffect(() => {
		document.body.style.overflow = "auto";
		return () => {
			document.body.style.overflow = "auto";
		};
	}, []);

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

	const getNearestHourData = (hourlyData) => {
		const now = new Date();
		return hourlyData.reduce((nearest, current) => {
			const currentTime = new Date(current.ts);
			const nearestTime = new Date(nearest.ts);
			return Math.abs(currentTime - now) < Math.abs(nearestTime - now)
				? current
				: nearest;
		});
	};

	if (loading || !cityData) {
		return <div className={cx("loading")}></div>;
	}

	return (
		<div className={cx("container")}>
			<div className={cx("top-section")}>
				<LocationInfo cityData={cityData} />
				<CurrentAirQuality cityData={cityData} />
			</div>
			<HourlyForecast hourlyData={cityData.forecasts.hourly} />
			{cityData.forecasts?.hourly && (
				<HistoricalAirQuality
					cityName={cityData.name}
					data={cityData.forecasts.hourly.map((item) => ({
						time: new Date(item.ts).toLocaleTimeString(),
						metrics: {
							AQI_US: {
								value: item.aqi,
								color:
									item.aqi <= 50
										? "#a8e05f"
										: item.aqi <= 100
										? "#fdd64b"
										: item.aqi <= 150
										? "#ff9b57"
										: item.aqi <= 200
										? "#fe6a69"
										: item.aqi <= 300
										? "#a97abc"
										: "#a87383",
							},
							TEMPERATURE: {
								value: item.temperature,
								color: "#ff9b57",
							},
							HUMIDITY: {
								value: item.humidity,
								color: "#4dabf7",
							},
						},
						quality: getAQIClassName(item.aqi),
						qualityText: t(`airQualityRanking.quality.${getAQIStatus(item.aqi)}`),
						timestamp: item.ts,
					}))}
					initialHoveredPoint={getNearestHourData(cityData.forecasts.hourly)}
				/>
			)}
			<DailyForecast forecasts={cityData.forecasts.daily} />
			<Recommendations recommendations={cityData.recommendations} />
		</div>
	);
}

export default AirQualityPages;
