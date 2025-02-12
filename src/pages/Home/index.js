import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { IoSearchOutline, IoCloseCircle } from "react-icons/io5";
import { BiCurrentLocation } from "react-icons/bi";
import classNames from "classnames/bind";
import styles from "./Home.module.scss";
import weatherService from "../../utils/request";
import WeatherResult from "../../components/WeatherResult";

const cx = classNames.bind(styles);

function Home() {
	const { t, i18n } = useTranslation();
	const [searchQuery, setSearchQuery] = useState("");
	const [weatherData, setWeatherData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [suggestions, setSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const searchBoxRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
				setShowSuggestions(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleSearch = async (e) => {
		e.preventDefault();
		if (!searchQuery.trim()) return;

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
		} finally {
			setLoading(false);
		}
	};

	const handleClear = () => {
		setSearchQuery("");
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

				<form className={cx("search-form")} onSubmit={handleSearch}>
					<div className={cx("search-box")} ref={searchBoxRef}>
						<IoSearchOutline className={cx("search-icon")} />
						<input
							type="text"
							placeholder={t("home.searchPlaceholder")}
							value={searchQuery}
							onChange={handleInputChange}
							onFocus={() => setShowSuggestions(true)}
							className={cx("search-input")}
						/>
						{searchQuery && (
							<button type="button" className={cx("clear-button")} onClick={handleClear}>
								<IoCloseCircle />
							</button>
						)}
						{showSuggestions && suggestions.length > 0 && (
							<div className={cx("suggestions-container")}>
								{suggestions.map((suggestion, index) => (
									<div
										key={index}
										className={cx("suggestion-item")}
										onClick={() => handleSuggestionClick(suggestion)}
									>
										{suggestion.fullName}
									</div>
								))}
							</div>
						)}
					</div>
					<button
						type="button"
						className={cx("location-button")}
						onClick={handleGetLocation}
					>
						<BiCurrentLocation />
						<span className={cx("button-text")}>{t("home.useLocation")}</span>
					</button>
					<button
						type="submit"
						className={cx("search-button", { loading: loading })}
						disabled={loading}
					>
						{t("home.searchButton")}
					</button>
				</form>

				{error && <div className={cx("error-message")}>{error}</div>}

				{weatherData && <WeatherResult weatherData={weatherData} loading={loading} />}
			</div>
		</div>
	);
}

export default Home;
