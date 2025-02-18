import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";
import styles from "./DailyForecast.module.scss";

const cx = classNames.bind(styles);

function DailyForecast({ forecasts }) {
	const { t } = useTranslation();

	return (
		<div className={cx("daily-forecast")}>
			<h3>{t("airQualityRanking.forecast.sevenDay")}</h3>
			<div className={cx("forecast-list")}>
				{forecasts.map((day, index) => (
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
}

export default DailyForecast;
