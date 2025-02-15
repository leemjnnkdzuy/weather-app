import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";
import styles from "./AirQualityTable.module.scss";

const cx = classNames.bind(styles);

function AirQualityTable({ cities, onSort }) {
	const { t } = useTranslation();

	const getQualityClass = (value) => {
		if (value <= 50) return "good";
		if (value <= 100) return "moderate";
		if (value <= 150) return "unhealthySensitive";
		if (value <= 200) return "unhealthy";
		if (value <= 300) return "veryUnhealthy";
		return "hazardous";
	};

	return (
		<table className={cx("table")}>
			<thead>
				<tr>
					<th onClick={() => onSort("rank")}>{t("airQualityRanking.columns.rank")}</th>
					<th onClick={() => onSort("city")}>{t("airQualityRanking.columns.city")}</th>
					<th onClick={() => onSort("state")}>{t("airQualityRanking.columns.state")}</th>
					<th onClick={() => onSort("country")}>
						{t("airQualityRanking.columns.country")}
					</th>
					<th onClick={() => onSort("value")}>{t("airQualityRanking.columns.pm25")}</th>
					<th onClick={() => onSort("followersCount")}>
						{t("airQualityRanking.columns.followers")}
					</th>
					<th>{t("airQualityRanking.columns.lastUpdated")}</th>
				</tr>
			</thead>
			<tbody>
				{cities.map((city) => (
					<tr key={city.id}>
						<td>{city.rank}</td>
						<td>{city.city}</td>
						<td>{city.state}</td>
						<td>
							{city.flagURL && (
								<img
									src={city.flagURL}
									alt={city.country}
									style={{
										width: 20,
										marginRight: 8,
										verticalAlign: "middle",
									}}
									title={city.country}
								/>
							)}
							{city.country}
						</td>
						<td>
							<span className={cx("pm25Value", getQualityClass(city.value))}>
								{city.value}
							</span>
						</td>
						<td>{city.followersCount.toLocaleString()}</td>
						<td>{city.lastUpdated}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

export default AirQualityTable;
