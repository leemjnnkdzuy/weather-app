import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../utils/ThemeContext";
import classNames from "classnames/bind";
import styles from "./WorldAirQualityRanking.module.scss";
import { airQualityService } from "../../utils/request";
import AirQualityTable from "../../components/AirQualityTable";
import AQILegend from "../../components/AQILegend";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import CustomDropdown from "../../components/CustomDropdown";

const cx = classNames.bind(styles);

function WorldAirQualityRanking() {
	const { t, i18n } = useTranslation();
	const { isDarkMode } = useTheme();
	const [cities, setCities] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [perPage, setPerPage] = useState(50);
	const [sortConfig, setSortConfig] = useState({
		key: "rank",
		direction: "asc",
	});
	const [selectedRanges, setSelectedRanges] = useState([]);

	const sortOptions = [
		{ value: "rank-asc", label: t("airQualityRanking.sort.rankAsc") },
		{ value: "rank-desc", label: t("airQualityRanking.sort.rankDesc") },
		{ value: "value-asc", label: t("airQualityRanking.sort.aqiAsc") },
		{ value: "value-desc", label: t("airQualityRanking.sort.aqiDesc") },
		{ value: "city-asc", label: t("airQualityRanking.sort.cityAsc") },
		{ value: "city-desc", label: t("airQualityRanking.sort.cityDesc") },
	];

	const handleSortChange = (value) => {
		const [key, direction] = value.split("-");
		setSortConfig({ key, direction });
	};

	const handlePerPageChange = (delta) => {
		const newValue = perPage + delta;
		if (newValue >= 10 && newValue <= 100) {
			setPerPage(newValue);
		}
	};

	const fetchAirQualityData = useCallback(async () => {
		setLoading(true);
		try {
			const response = await airQualityService.getWorldRanking(
				1,
				perPage,
				i18n.language
			);
			const processedData = response.data.map((item) => ({
				...item,
				lastUpdated: new Date(item.updatedAt).toLocaleString(
					i18n.language === "vi" ? "vi-VN" : "en-US"
				),
			}));
			setCities(processedData);
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setLoading(false);
		}
	}, [perPage, i18n.language]);

	useEffect(() => {
		fetchAirQualityData();
	}, [fetchAirQualityData]);

	useEffect(() => {
		const handleLanguageChange = () => {
			setSearchTerm("");
			setSelectedRanges([]);
			fetchAirQualityData();
		};

		window.addEventListener("languageChange", handleLanguageChange);

		return () => {
			window.removeEventListener("languageChange", handleLanguageChange);
		};
	}, [fetchAirQualityData]);

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

	const getAqiRangeValues = (range) => {
		const [min, max] = range.split("-").map(Number);
		return { min, max: max || Infinity };
	};

	const filteredCities = sortedCities.filter((city) => {
		const matchesSearch =
			city.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
			city.country.toLowerCase().includes(searchTerm.toLowerCase());

		if (selectedRanges.length === 0) return matchesSearch;

		const matchesRange = selectedRanges.some((range) => {
			const { min, max } = getAqiRangeValues(range);
			return city.value >= min && city.value <= max;
		});

		return matchesSearch && matchesRange;
	});

	const handleRangeSelect = (range) => {
		setSelectedRanges((prev) => {
			const exists = prev.includes(range);
			if (exists) {
				return prev.filter((r) => r !== range);
			} else {
				return [...prev, range];
			}
		});
	};

	return (
		<div className={cx("container", { dark: isDarkMode })}>
			<div className={cx("header")}>
				<h1>{t("airQualityRanking.title")}</h1>
			</div>

			<AQILegend onRangeSelect={handleRangeSelect} selectedRanges={selectedRanges} />

			<div className={cx("controls")}>
				<div className={cx("search-box")}>
					<IoSearchOutline size={20} className={cx("search-icon")} />
					<input
						type="text"
						placeholder={t("airQualityRanking.search")}
						className={cx("searchInput")}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<div className={cx("pagination-controls")}>
					<button onClick={() => handlePerPageChange(-10)} disabled={perPage <= 10}>
						<MdKeyboardArrowLeft size={24} />
					</button>
					<span>{perPage} items</span>
					<button onClick={() => handlePerPageChange(10)} disabled={perPage >= 100}>
						<MdKeyboardArrowRight size={24} />
					</button>
				</div>
			</div>

			<div className={cx("sort-wrapper")}>
				<CustomDropdown
					options={sortOptions}
					value={`${sortConfig.key}-${sortConfig.direction}`}
					onChange={handleSortChange}
					placeholder={t("airQualityRanking.sort.label")}
				/>
			</div>

			{loading ? (
				<div className={cx("loading")}></div>
			) : (
				<AirQualityTable
					cities={filteredCities}
					sortConfig={sortConfig}
					onSort={handleSort}
					className={cx("table-header")}
				/>
			)}
		</div>
	);
}

export default WorldAirQualityRanking;
