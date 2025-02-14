import { useState, useEffect } from "react";
import styles from "./WorldAirQualityRanking.module.scss";
import { airQualityService } from "../../utils/request";

function WorldAirQualityRanking() {
	const [cities, setCities] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortConfig, setSortConfig] = useState({
		key: "value",
		direction: "desc",
	});

	useEffect(() => {
		fetchAirQualityData();
	}, []);

	const fetchAirQualityData = async () => {
		try {
			const data = await airQualityService.getWorldRanking();
			const processedData = data.map((item) => ({
				...item,
				rank: item.id,
				aqi: item.value,
				quality: getQualityLevel(item.value),
				lastUpdated: new Date(item.lastUpdated).toLocaleString("vi-VN"),
			}));
			setCities(processedData);
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setLoading(false);
		}
	};

	const getQualityLevel = (value) => {
		if (value <= 50) return "good";
		if (value <= 100) return "moderate";
		if (value <= 150) return "unhealthy-sensitive";
		if (value <= 200) return "unhealthy";
		if (value <= 300) return "very-unhealthy";
		return "hazardous";
	};

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
		<div className={styles.container}>
			<div className={styles.header}>
				<h1>World Air Quality Ranking</h1>
			</div>

			<div className={styles.controls}>
				<input
					type="text"
					placeholder="Search by city or country..."
					className={styles.searchInput}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			{loading ? (
				<div className={styles.loading}>Loading air quality data...</div>
			) : (
				<table className={styles.table}>
					<thead>
						<tr>
							<th onClick={() => handleSort("rank")}>Rank</th>
							<th onClick={() => handleSort("city")}>City</th>
							<th onClick={() => handleSort("country")}>Country</th>
							<th onClick={() => handleSort("aqi")}>PM2.5</th>
							<th onClick={() => handleSort("quality")}>Quality</th>
							<th>Provider</th>
							<th>Last Updated</th>
						</tr>
					</thead>
					<tbody>
						{filteredCities.map((city) => (
							<tr key={city.id}>
								<td>{city.rank}</td>
								<td>{city.city}</td>
								<td>{city.country}</td>
								<td>{city.aqi}</td>
								<td>
									<span className={`${styles.qualityIndicator} ${styles[city.quality]}`}>
										{city.quality.toUpperCase()}
									</span>
								</td>
								<td>{city.provider}</td>
								<td>{city.lastUpdated}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}

export default WorldAirQualityRanking;
