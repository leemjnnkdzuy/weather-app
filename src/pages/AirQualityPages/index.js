import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { airQualityService } from "../../utils/request";
import classNames from "classnames/bind";
import styles from "./AirQualityPages.module.scss";
import LocationInfo from "../../components/LocationInfo";
import CurrentAirQuality from "../../components/CurrentAirQuality";
import HourlyForecast from "../../components/HourlyForecast";
import DailyForecast from "../../components/DailyForecast";
import Recommendations from "../../components/Recommendations";
import HistoricalAirQuality from "../../components/HistoricalAirQuality";

const cx = classNames.bind(styles);

function AirQualityPages() {
	const { cityId } = useParams();
	const { i18n } = useTranslation();
	const [cityData, setCityData] = useState(null);
	const [measurements, setMeasurements] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const [cityDetails, measurementsData] = await Promise.all([
					airQualityService.getCityDetails(cityId, i18n.language),
					airQualityService.getCityMeasurements(cityId, i18n.language),
				]);
				setCityData(cityDetails);
				setMeasurements(measurementsData);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
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

	if (loading || !cityData || !measurements) {
		return <div className={cx("loading")}></div>;
	}

	return (
		<div className={cx("container")}>
			<div className={cx("top-section")}>
				<LocationInfo cityData={cityData} />
				<CurrentAirQuality cityData={cityData} />
			</div>
			<HistoricalAirQuality hourlyData={measurements.measurements.hourly} />
			<HourlyForecast hourlyData={cityData.forecasts.hourly} />
			<DailyForecast forecasts={cityData.forecasts.daily} />
			<Recommendations recommendations={cityData.recommendations} />
		</div>
	);
}

export default AirQualityPages;
