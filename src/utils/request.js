import axios from "axios";

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = "f5addf117cf047def6a4d2d9f24f7f99";

const weatherApi = axios.create({
	baseURL: BASE_URL,
	params: {
		appid: API_KEY,
		units: "metric",
		lang: "en",
	},
});

export const setApiLanguage = (lang) => {
	weatherApi.defaults.params.lang = lang;
};

export const weatherService = {
	getCurrentWeather: async (city, lang = "en") => {
		try {
			const response = await weatherApi.get("/weather", {
				params: {
					q: city,
					lang: lang,
				},
			});
			return response.data;
		} catch (error) {
			throw error.response?.data || error;
		}
	},

	getForecast: async (city) => {
		try {
			const response = await weatherApi.get("/forecast", {
				params: { q: city },
			});
			return response.data;
		} catch (error) {
			throw error.response?.data || error;
		}
	},

	getWeatherByCoords: async (lat, lon, lang = "en") => {
		try {
			const response = await weatherApi.get("/weather", {
				params: {
					lat,
					lon,
					lang: lang,
				},
			});
			return response.data;
		} catch (error) {
			throw error.response?.data || error;
		}
	},

	getAirPollution: async (lat, lon) => {
		try {
			const response = await weatherApi.get("/air_pollution", {
				params: { lat, lon },
			});
			return response.data;
		} catch (error) {
			throw error.response?.data || error;
		}
	},

	getLocationSuggestions: async (query, lang = "en") => {
		if (!query || query.length < 2) return [];
		try {
			const response = await axios.get(
				`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}&lang=${lang}`
			);
			return response.data.map((item) => ({
				name: item.local_names?.[lang] || item.name,
				fullName: `${item.name}, ${item.country}`,
				lat: item.lat,
				lon: item.lon,
				country: item.country,
			}));
		} catch (error) {
			console.error("Error fetching suggestions:", error);
			return [];
		}
	},
};

const CLOUDFLARE_WORKER =
	"https://worldairqualityranking-api.leemjnnkdzuy.live";

export const airQualityService = {
	getWorldRanking: async (page = 1, perPage = 100, lang = "en") => {
		try {
			page = Math.min(Math.max(parseInt(page), 1), 100);
			perPage = Math.min(Math.max(parseInt(perPage), 1), 100);

			const response = await axios.get(`${CLOUDFLARE_WORKER}/rankings`, {
				params: { page, perPage, language: lang },
			});

			const dataArray = response.data;
			if (!Array.isArray(dataArray)) {
				throw new Error("Invalid response format");
			}

			return {
				data: dataArray.map((item) => ({
					id: item.id,
					city: item.city,
					state: item.state,
					country: item.country,
					value: item.aqi,
					flagURL: item.flagURL,
					provider: "AirVisual",
					followersCount: item.followersCount,
					updatedAt: item.updatedAt,
					rank: item.rank,
				})),
				pagination: {
					currentPage: page,
					perPage: perPage,
					totalItems: dataArray.length,
				},
			};
		} catch (error) {
			console.error("Error fetching air quality data:", error.response || error);
			throw error.response?.data?.message || error.message || "Failed to fetch data";
		}
	},
};

export default weatherService;
