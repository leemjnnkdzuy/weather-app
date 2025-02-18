import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";
import styles from "./DailyForecast.module.scss";
import {
	WiDaySunny,
	WiRain,
	WiCloudy,
	WiDayCloudy,
	WiHumidity,
	WiBarometer,
	WiStrongWind,
	WiWindDeg,
} from "react-icons/wi";
import {
	formatDay,
	formatDate,
	formatWindDirection,
} from "../../utils/formatters";

const cx = classNames.bind(styles);

const weatherIcons = {
	"clear-sky": WiDaySunny,
	rain: WiRain,
	"scattered-clouds": WiCloudy,
	"new-clouds": WiDayCloudy,
};

function DailyForecast({ forecasts }) {
	const { t, i18n } = useTranslation();

	return (
		<div className={cx("daily-forecast")}>
			<h3>{t("airQualityRanking.forecast.sevenDay")}</h3>
			<div className={cx("forecast-list")}>
				{forecasts.map((day, index) => {
					const WeatherIcon = weatherIcons[day.icon] || WiCloudy;
					return (
						<div key={index} className={cx("forecast-day")}>
							<div className={cx("date")}>
								<span className={cx("day-name")}>{formatDay(day.ts, t)}</span>
								<span className={cx("date-num")}>{formatDate(day.ts, i18n.language)}</span>
							</div>

							<div className={cx("weather-icon")}>
								<WeatherIcon size={40} />
								<p className={cx("condition")}>{day.condition}</p>
							</div>

							<div className={cx("weather-details")}>
								<div className={cx("detail-item")}>
									<WiBarometer />
									<span>{day.pressure} hPa</span>
								</div>

								<div className={cx("detail-item")}>
									<WiHumidity />
									<span>{day.humidity}%</span>
								</div>

								<div className={cx("wind-info")}>
									<div className={cx("detail-item")}>
										<WiStrongWind />
										<span>{day.wind.speed} m/s</span>
									</div>
									<div className={cx("detail-item")}>
										<WiWindDeg style={{ transform: `rotate(${day.wind.direction}deg)` }} />
										<span>{formatWindDirection(day.wind.direction, i18n.language)}</span>
									</div>
								</div>
							</div>

							<div className={cx("temperature")}>
								<span className={cx("temp-max")}>{day.temperature.max}°</span>
								<span className={cx("temp-min")}>{day.temperature.min}°</span>
							</div>

							<div
								className={cx(
									"aqi",
									`aqi-${day.aqi <= 50 ? "good" : day.aqi <= 100 ? "moderate" : "poor"}`
								)}
							>
								AQI: {day.aqi}
							</div>

							{day.probabilityOfRain && (
								<div className={cx("rain-probability")}>
									<WiRain />
									<span>
										{t("weather.rainChance")}: {day.probabilityOfRain}%
									</span>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default DailyForecast;
