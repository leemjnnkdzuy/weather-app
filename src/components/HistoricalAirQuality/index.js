import { Line } from "react-chartjs-2";
import { format } from "date-fns/format";
import { vi, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../utils/ThemeContext";
import classNames from "classnames/bind";
import styles from "./HistoricalAirQuality.module.scss";

const cx = classNames.bind(styles);

const getAqiColor = (aqi) => {
	if (aqi <= 50) return "#00e400";
	if (aqi <= 100) return "#ffff00";
	if (aqi <= 150) return "#ff7e00";
	if (aqi <= 200) return "#ff0000";
	if (aqi <= 300) return "#8f3f97";
	return "#7e0023";
};

function HistoricalAirQuality({ hourlyData }) {
	const { t, i18n } = useTranslation();
	const { isDarkMode } = useTheme();
	const dateLocale = i18n.language === "vi" ? vi : enUS;

	const chartData = {
		labels: hourlyData.map((item) =>
			format(new Date(item.ts), "HH:mm - dd/MM", { locale: dateLocale })
		),
		datasets: [
			{
				label: t("airQualityRanking.historical.metrics.AQI_US"),
				data: hourlyData.map((item) => item.aqi),
				borderColor: hourlyData.map((item) => getAqiColor(item.aqi)),
				segment: {
					borderColor: (ctx) => getAqiColor(ctx.p0.parsed.y),
				},
				tension: 0.4,
				pointBackgroundColor: hourlyData.map((item) => getAqiColor(item.aqi)),
				pointRadius: 4,
				pointHoverRadius: 6,
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		interaction: {
			mode: "index",
			intersect: false,
		},
		scales: {
			y: {
				beginAtZero: true,
				grid: {
					color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
				},
				ticks: {
					color: isDarkMode ? "#fff" : "#000",
				},
			},
			x: {
				grid: {
					color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
				},
				ticks: {
					color: isDarkMode ? "#fff" : "#000",
					maxRotation: 45,
					minRotation: 45,
				},
			},
		},
		plugins: {
			legend: {
				labels: {
					color: isDarkMode ? "#fff" : "#000",
				},
			},
			tooltip: {
				callbacks: {
					label: (context) => {
						const aqi = context.parsed.y;
						let quality = "";
						if (aqi <= 50) quality = t("airQualityRanking.quality.good");
						else if (aqi <= 100) quality = t("airQualityRanking.quality.moderate");
						else if (aqi <= 150)
							quality = t("airQualityRanking.quality.unhealthySensitive");
						else if (aqi <= 200) quality = t("airQualityRanking.quality.unhealthy");
						else if (aqi <= 300) quality = t("airQualityRanking.quality.veryUnhealthy");
						else quality = t("airQualityRanking.quality.hazardous");

						return `AQI: ${aqi} - ${quality}`;
					},
				},
			},
		},
	};

	return (
		<div className={cx("historical-chart")}>
			<h3>{t("airQualityRanking.historical.title")}</h3>
			<div className={cx("chart-container")}>
				<Line data={chartData} options={options} />
			</div>
		</div>
	);
}

export default HistoricalAirQuality;
