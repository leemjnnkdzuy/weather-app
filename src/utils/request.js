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

	getLocationSuggestions: async (query) => {
		if (!query || query.length < 2) return [];
		try {
			const response = await axios.get(
				`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
			);
			return response.data.map((item) => ({
				name: item.local_names?.en || item.name,
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
	"https://worldairqualityranking-api.leemjnnkdzuy.live/";

export const airQualityService = {
	getWorldRanking: async () => {
		try {
			const response = await axios.get(`${CLOUDFLARE_WORKER}/countries/rankings`, {
				params: {
					sortBy: "aqi",
					sortOrder: "desc",
					page: 1,
					perPage: 100,
					display: "full",
					"units.temperature": "celsius",
					"units.distance": "kilometer",
					"units.pressure": "millibar",
					"units.system": "metric",
					AQI: "US",
					language: "vi",
				},
			});

			if (!response.data?.data) {
				throw new Error("No air quality data available");
			}

			return response.data.data.map((item, index) => ({
				id: index + 1,
				city: item.city,
				country: item.country,
				value: item.current.pollution.aqius,
				coordinates: {
					latitude: item.location.coordinates[1],
					longitude: item.location.coordinates[0],
				},
				lastUpdated: item.current.pollution.ts,
				provider: "AirVisual",
			}));
		} catch (error) {
			console.error("Error fetching air quality data:", error.message);
			throw new Error("Unable to fetch air quality data. Please try again later.");
		}
	},
};

export default weatherService;
