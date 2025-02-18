import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";
import styles from "./CurrentAirQuality.module.scss";
import { formatPollutantName } from "../../utils/formatters";

const cx = classNames.bind(styles);

function CurrentAirQuality({ cityData }) {
	const { t } = useTranslation();

	return (
		<div className={cx("wrapper")}>
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
}

export default CurrentAirQuality;
