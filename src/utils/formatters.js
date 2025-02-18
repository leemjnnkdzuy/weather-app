export const METRICS = {
	AQI_US: "AQI⁺ Mỹ",
	TEMPERATURE: "Nhiệt độ",
	HUMIDITY: "Độ ẩm",
};

export const formatPollutantName = (name) => {
	const pollutantMap = {
		pm25: "PM₂.₅",
		pm10: "PM₁₀",
		o3: "O₃",
		no2: "NO₂",
		so2: "SO₂",
		co: "CO",
	};
	return pollutantMap[name.toLowerCase()] || name;
};

export const getMetricStatus = (value, metric) => {
	if (metric === "AQI_US") {
		if (value <= 50) return "good";
		if (value <= 100) return "moderate";
		if (value <= 150) return "unhealthySensitive";
		if (value <= 200) return "unhealthy";
		if (value <= 300) return "veryUnhealthy";
		return "hazardous";
	}
	if (metric === "TEMPERATURE") {
		if (value <= 0) return "veryCold";
		if (value <= 10) return "cold";
		if (value <= 20) return "cool";
		if (value <= 25) return "moderate";
		if (value <= 30) return "warm";
		return "hot";
	}
	if (metric === "HUMIDITY") {
		if (value <= 30) return "dry";
		if (value <= 70) return "moderate";
		return "humid";
	}
	return "moderate";
};

export const getTemperatureColor = (value) => {
	if (value <= 0) return "#0000FF";
	if (value <= 10) return "#00BFFF";
	if (value <= 20) return "#90EE90";
	if (value <= 25) return "#FFD700";
	if (value <= 30) return "#FFA500";
	return "#FF4500";
};

export const getHumidityColor = (value) => {
	if (value <= 30) return "#FFB6C1";
	if (value <= 70) return "#90EE90";
	return "#87CEEB";
};

export const getAqiColor = (value) => {
	if (value <= 50) return "#00e400";
	if (value <= 100) return "#ffff00";
	if (value <= 150) return "#ff7e00";
	if (value <= 200) return "#ff0000";
	if (value <= 300) return "#8f3f97";
	return "#7e0023";
};

export const getAqiBandSettings = () => [
	{ from: 0, to: 50, color: "rgba(0, 228, 0, 0.1)", label: "Tốt" },
	{ from: 51, to: 100, color: "rgba(255, 255, 0, 0.1)", label: "Trung bình" },
	{
		from: 101,
		to: 150,
		color: "rgba(255, 126, 0, 0.1)",
		label: "Không tốt cho nhóm nhạy cảm",
	},
	{
		from: 151,
		to: 200,
		color: "rgba(255, 0, 0, 0.1)",
		label: "Không tốt cho sức khỏe",
	},
	{
		from: 201,
		to: 300,
		color: "rgba(143, 63, 151, 0.1)",
		label: "Rất không tốt cho sức khỏe",
	},
	{ from: 301, to: 500, color: "rgba(126, 0, 35, 0.1)", label: "Nguy hại" },
];

export const getAQIStatus = (aqi) => {
	if (aqi <= 50) return "good";
	if (aqi <= 100) return "moderate";
	if (aqi <= 150) return "unhealthySensitive";
	if (aqi <= 200) return "unhealthy";
	if (aqi <= 300) return "veryUnhealthy";
	return "hazardous";
};

export const getAQIClassName = (aqi) => {
	if (aqi <= 50) return "good";
	if (aqi <= 100) return "moderate";
	if (aqi <= 150) return "sensitive";
	if (aqi <= 200) return "unhealthy";
	if (aqi <= 300) return "very-unhealthy";
	return "hazardous";
};

export const createChartHandlers = {
	AQI_US: (reversedData, setHoveredPoint, lastPointRef) => (e, chart) => {
		if (!chart || !chart.pointer) return;

		try {
			const event = chart.pointer.normalize(e);
			const point = chart.series[0].searchPoint(event, true);

			if (point && point.index >= 0 && point.index < reversedData.length) {
				const currentData = reversedData[point.index];
				if (currentData.metrics?.AQI_US) {
					const newPoint = {
						value: currentData.metrics.AQI_US.value,
						time: currentData.time,
						quality: currentData.quality,
						qualityText: currentData.qualityText,
						timestamp: currentData.timestamp,
					};
					setHoveredPoint(newPoint);
					lastPointRef.current = newPoint;
				}
			}
		} catch (error) {
			console.error("Error in AQI chart handler:", error);
		}
	},

	TEMPERATURE: (reversedData, setHoveredPoint, lastPointRef) => (e, chart) => {
		if (!chart || !chart.pointer) return;

		try {
			const event = chart.pointer.normalize(e);
			const point = chart.series[0].searchPoint(event, true);

			if (point && point.index >= 0 && point.index < reversedData.length) {
				const currentData = reversedData[point.index];
				if (currentData.metrics?.TEMPERATURE) {
					const value = Number(currentData.metrics.TEMPERATURE.value).toFixed(1);
					const newPoint = {
						value: value,
						time: currentData.time,
						quality: "normal",
						qualityText: `${value}°C`,
						timestamp: currentData.timestamp,
					};
					setHoveredPoint(newPoint);
					lastPointRef.current = newPoint;
				}
			}
		} catch (error) {
			console.error("Error in Temperature chart handler:", error);
		}
	},

	HUMIDITY: (reversedData, setHoveredPoint, lastPointRef) => (e, chart) => {
		if (!chart || !chart.pointer) return;

		try {
			const event = chart.pointer.normalize(e);
			const point = chart.series[0].searchPoint(event, true);

			if (point && point.index >= 0 && point.index < reversedData.length) {
				const currentData = reversedData[point.index];
				if (currentData.metrics?.HUMIDITY) {
					const value = currentData.metrics.HUMIDITY.value;
					const newPoint = {
						value: value,
						time: currentData.time,
						quality: "normal",
						qualityText: `${value}%`,
						timestamp: currentData.timestamp,
					};
					setHoveredPoint(newPoint);
					lastPointRef.current = newPoint;
				}
			}
		} catch (error) {
			console.error("Error in Humidity chart handler:", error);
		}
	},
};
