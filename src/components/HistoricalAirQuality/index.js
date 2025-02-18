import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";
import styles from "./HistoricalAirQuality.module.scss";
import AqiChart from "./AqiChart";
import TemperatureChart from "./TemperatureChart";
import HumidityChart from "./HumidityChart";

const cx = classNames.bind(styles);

const METRICS = {
	AQI_US: "AQI⁺ Mỹ",
	TEMPERATURE: "Nhiệt độ",
	HUMIDITY: "Độ ẩm",
};

const getAQIStatus = (aqi) => {
	if (aqi <= 50) return "good";
	if (aqi <= 100) return "moderate";
	if (aqi <= 150) return "unhealthySensitive";
	if (aqi <= 200) return "unhealthy";
	if (aqi <= 300) return "veryUnhealthy";
	return "hazardous";
};

const getMetricStatus = (value, metric) => {
	if (metric === "AQI_US") return getAQIStatus(value);
	if (metric === "TEMPERATURE") {
		if (value <= 15) return "cold";
		if (value <= 25) return "moderate";
		return "hot";
	}
	if (metric === "HUMIDITY") {
		if (value <= 30) return "dry";
		if (value <= 70) return "moderate";
		return "humid";
	}
	return "moderate";
};

function HistoricalAirQuality({ cityName, data }) {
	const { t, i18n } = useTranslation();
	const [metric, setMetric] = useState("AQI_US");
	const [isTransitioning, setIsTransitioning] = useState(false); // Add this state
	const chartRef = useRef(null);

	const getNearestPoint = useCallback(() => {
		const now = new Date();
		const nearest = data.reduce((nearest, current) => {
			const currentTime = new Date(current.timestamp);
			const nearestTime = new Date(nearest.timestamp);
			return Math.abs(currentTime - now) < Math.abs(nearestTime - now)
				? current
				: nearest;
		});

		return {
			value: nearest.metrics[metric].value,
			time: nearest.time,
			quality: nearest.quality,
			qualityText:
				metric === "AQI_US"
					? nearest.qualityText
					: t(
							`metrics.${metric.toLowerCase()}.${getMetricStatus(
								nearest.metrics[metric].value,
								metric
							)}`
					  ),
			timestamp: nearest.timestamp,
		};
	}, [data, metric, t]);

	const [hoveredPoint, setHoveredPoint] = useState(getNearestPoint);
	const lastPointRef = useRef(hoveredPoint);

	useEffect(() => {
		const newPoint = getNearestPoint();
		setHoveredPoint(newPoint);
		lastPointRef.current = newPoint;
	}, [metric, getNearestPoint]);

	const getAQIBoxClass = (aqi) => {
		if (aqi <= 50) return "aqi-box-green";
		if (aqi <= 100) return "aqi-box-yellow";
		if (aqi <= 150) return "aqi-box-orange";
		if (aqi <= 200) return "aqi-box-red";
		if (aqi <= 300) return "aqi-box-purple";
		return "aqi-box-maroon";
	};

	const reversedData = useMemo(() => {
		return [...data].reverse();
	}, [data]);

	const handleMouseMove = useRef((e, chart) => {
		const event = chart.pointer.normalize(e);
		const point = chart.series[0].searchPoint(event, true);

		if (point && point.index >= 0 && point.index < reversedData.length) {
			const currentData = reversedData[point.index];

			if (currentData.metrics && currentData.metrics[metric]) {
				const metricValue = currentData.metrics[metric].value;

				const newPoint = {
					value: metricValue,
					time: currentData.time,
					quality: metric === "AQI_US" ? currentData.quality : "normal",
					qualityText:
						metric === "AQI_US"
							? currentData.qualityText
							: metric === "TEMPERATURE"
							? `${metricValue}°C`
							: `${metricValue}%`,
					timestamp: currentData.timestamp,
				};
				setHoveredPoint(newPoint);
				lastPointRef.current = newPoint;
			}
		}
	}).current;

	const handleMouseLeave = () => {
		setHoveredPoint(lastPointRef.current);
	};

	const handleMetricChange = (newMetric) => {
		setIsTransitioning(true);
		setMetric(newMetric);
		setTimeout(() => {
			setIsTransitioning(false);
		}, 800);
	};

	useEffect(() => {
		const chart = chartRef.current;
		return () => {
			if (chart?.container && chart?.eventHandlers) {
				const { container, eventHandlers } = chart;
				container.removeEventListener("mousemove", eventHandlers.mousemove);
				container.removeEventListener("mouseleave", eventHandlers.mouseleave);
			}
		};
	}, []);

	const renderTooltipContent = () => {
		if (!hoveredPoint) return null;

		const getDotClass = () => {
			if (metric === "AQI_US") {
				return getAQIBoxClass(hoveredPoint.value);
			} else if (metric === "HUMIDITY") {
				if (hoveredPoint.value <= 30) return "humidity-dry";
				if (hoveredPoint.value <= 70) return "humidity-normal";
				return "humidity-humid";
			}
			return "";
		};

		return (
			<div className={cx("pollutant-tooltip")}>
				<div className={cx("pollutant-tooltip__top")}>
					<div className={cx("pollutant-tooltip__dot-title")}>
						<div className={cx("pollutant-tooltip__dot", getDotClass())} />
						<span className={cx("pollutant-tooltip__title")}>
							{hoveredPoint.value}{" "}
							{metric === "AQI_US" ? "AQI⁺ Mỹ" : metric === "TEMPERATURE" ? "°C" : "%"}
						</span>
					</div>
					{metric === "AQI_US" && (
						<span className={cx("pollutant-tooltip__label")}>
							{hoveredPoint.qualityText}
						</span>
					)}
				</div>
				<div className={cx("pollutant-tooltip__timestamp")}>
					{new Date(hoveredPoint.timestamp).toLocaleDateString(i18n.language, {
						weekday: "short",
						month: "short",
						day: "numeric",
					})}{" "}
					{t("airQualityRanking.historical.localTime")}
				</div>
			</div>
		);
	};

	const renderChart = () => {
		const props = {
			data: reversedData,
			handleMouseMove,
			handleMouseLeave,
		};

		switch (metric) {
			case "TEMPERATURE":
				return <TemperatureChart {...props} />;
			case "HUMIDITY":
				return <HumidityChart {...props} />;
			default: // AQI_US
				return <AqiChart {...props} />;
		}
	};

	return (
		<div className={cx("historical-card")}>
			<div className={cx("title-container")}>
				<div className={cx("title-group")}>
					<span className={cx("title")}>{t("airQualityRanking.historical.title")}</span>
					<h2 className={cx("description")}>
						{t("airQualityRanking.historical.description", { city: cityName })}
					</h2>
				</div>

				<div className={cx("controls")}>
					{renderTooltipContent()}
					<div className={cx("metric-selector")}>
						{Object.entries(METRICS).map(([key, label]) => (
							<button
								key={key}
								className={cx("metric-button", { active: metric === key })}
								onClick={() => handleMetricChange(key)}
							>
								{t(`airQualityRanking.historical.metrics.${key}`)}
							</button>
						))}
					</div>
				</div>
			</div>

			<div className={cx("chart-container")}>
				<div className={cx("chart-transition", { active: isTransitioning })} />
				{renderChart()}
			</div>
		</div>
	);
}

export default HistoricalAirQuality;
