import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../utils/ThemeContext";
import classNames from "classnames/bind";
import styles from "./WorldAirQualityRanking.module.scss";
import { airQualityService } from "../../utils/request";
import AirQualityTable from "../../components/AirQualityTable";
import AQILegend from "../../components/AQILegend";

const cx = classNames.bind(styles);

function WorldAirQualityRanking() {
	const { t } = useTranslation();
	const { isDarkMode } = useTheme();
	const [cities, setCities] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortConfig, setSortConfig] = useState({
		key: "value",
		direction: "desc",
	});

	useEffect(() => {
		const fetchAirQualityData = async () => {
			try {
				const response = await airQualityService.getWorldRanking();
				const processedData = response.data.map((item) => ({
					...item,
					lastUpdated: new Date(item.updatedAt).toLocaleString("vi-VN"),
				}));
				setCities(processedData);
			} catch (error) {
				console.error("Error:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchAirQualityData();
	}, []);

	const handleSort = (key) => {
		const direction =
			sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
		setSortConfig({ key, direction });
	};

	const sortedCities = [...cities].sort((a, b) => {
		if (sortConfig.direction === "asc") {
			return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
		}
		return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
	});

	const filteredCities = sortedCities.filter(
		(city) =>
			city.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
			city.country.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className={cx("container", { dark: isDarkMode })}>
			<div className={cx("header")}>
				<h1>{t("airQualityRanking.title")}</h1>
			</div>

			<AQILegend />

			<div className={cx("controls")}>
				<input
					type="text"
					placeholder={t("airQualityRanking.search")}
					className={cx("searchInput")}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			{loading ? (
				<div className={cx("loading")}>{t("airQualityRanking.loading")}</div>
			) : (
				<AirQualityTable
					cities={filteredCities}
					sortConfig={sortConfig}
					onSort={handleSort}
				/>
			)}
		</div>
	);
}

export default WorldAirQualityRanking;
