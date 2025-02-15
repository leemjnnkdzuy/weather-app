import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";
import styles from "./Home.module.scss";
import weatherService from "../../utils/request";
import WeatherResult from "../../components/WeatherResult";
import SearchForm from "../../components/SearchForm";
import Popup from "../../components/Popup";

const cx = classNames.bind(styles);

function Home() {
	const { t, i18n } = useTranslation();
	const [searchQuery, setSearchQuery] = useState("");
	const [weatherData, setWeatherData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [suggestions, setSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [showEmptyInputPopup, setShowEmptyInputPopup] = useState(false);
	const [showErrorPopup, setShowErrorPopup] = useState(false);

	const handleSearch = async (e) => {
		e.preventDefault();
		if (!searchQuery.trim()) {
			setShowEmptyInputPopup(true);
			return;
		}

		setLoading(true);
		setError(null);
		try {
			const data = await weatherService.getCurrentWeather(searchQuery, i18n.language);
			setWeatherData(data);
			const airData = await weatherService.getAirPollution(
				data.coord.lat,
				data.coord.lon
			);
			setWeatherData((prev) => ({ ...prev, airQuality: airData.list[0] }));
		} catch (err) {
			setError(err.message || "Error fetching weather data");
			setShowErrorPopup(true);
		} finally {
			setLoading(false);
		}
	};

	const handleClear = () => {
		setSearchQuery("");
	};

	const handleCloseWeather = () => {
		setWeatherData(null);
		setError(null);
	};

	const handleGetLocation = () => {
		if (navigator.geolocation) {
			setLoading(true);
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					try {
						const data = await weatherService.getWeatherByCoords(
							position.coords.latitude,
							position.coords.longitude,
							i18n.language
						);
						setWeatherData(data);
					} catch (err) {
						setError(err.message);
					} finally {
						setLoading(false);
					}
				},
				(err) => {
					setError("Location access denied");
					setLoading(false);
				}
			);
		}
	};

	const handleInputChange = async (e) => {
		const value = e.target.value;
		setSearchQuery(value);

		if (value.length >= 2) {
			const results = await weatherService.getLocationSuggestions(value);
			setSuggestions(results);
			setShowSuggestions(true);
		} else {
			setSuggestions([]);
			setShowSuggestions(false);
		}
	};

	const handleSuggestionClick = async (suggestion) => {
		setSearchQuery(suggestion.fullName);
		setShowSuggestions(false);
		setLoading(true);
		setError(null);

		try {
			const data = await weatherService.getWeatherByCoords(
				suggestion.lat,
				suggestion.lon,
				i18n.language
			);
			setWeatherData(data);
			const airData = await weatherService.getAirPollution(
				suggestion.lat,
				suggestion.lon
			);
			setWeatherData((prev) => ({ ...prev, airQuality: airData.list[0] }));
		} catch (err) {
			setError(err.message || "Error fetching weather data");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (weatherData?.name) {
			setLoading(true);
			const updateWeatherLanguage = async () => {
				try {
					const data = await weatherService.getCurrentWeather(
						weatherData.name,
						i18n.language
					);
					setWeatherData((prev) => ({
						...prev,
						weather: [
							{
								...prev.weather[0],
								description: data.weather[0].description,
							},
						],
					}));
				} catch (err) {
					console.error("Error updating weather description:", err);
				} finally {
					setLoading(false);
				}
			};

			const timer = setTimeout(() => {
				updateWeatherLanguage();
			}, 100);

			return () => clearTimeout(timer);
		}
	}, [i18n.language, weatherData?.name]);

	return (
		<div className={cx("wrapper")}>
			<div className={cx("search-section")}>
				<h1 className={cx("title")}>{t("home.title")}</h1>
				<p className={cx("subtitle")}>{t("home.subtitle")}</p>

				<SearchForm
					searchQuery={searchQuery}
					handleInputChange={handleInputChange}
					handleSearch={handleSearch}
					handleClear={handleClear}
					handleGetLocation={handleGetLocation}
					handleSuggestionClick={handleSuggestionClick}
					suggestions={suggestions}
					showSuggestions={showSuggestions}
					setShowSuggestions={setShowSuggestions}
					loading={loading}
					t={t}
				/>

				{weatherData && (
					<WeatherResult
						weatherData={weatherData}
						loading={loading}
						onClose={handleCloseWeather}
					/>
				)}
			</div>

			{showEmptyInputPopup && (
				<Popup
					message={t("home.emptyInputError")}
					type="error"
					onClose={() => setShowEmptyInputPopup(false)}
				/>
			)}

			{showErrorPopup && error && (
				<Popup message={error} type="error" onClose={() => setShowErrorPopup(false)} />
			)}
		</div>
	);
}

export default Home;
