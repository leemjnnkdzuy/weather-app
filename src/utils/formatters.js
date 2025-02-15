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
