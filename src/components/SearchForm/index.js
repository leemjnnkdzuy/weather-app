import React, { useRef, useEffect } from "react";
import { IoSearchOutline, IoCloseCircle } from "react-icons/io5";
import { BiCurrentLocation } from "react-icons/bi";
import Flags from "country-flag-icons/react/3x2";
import classNames from "classnames/bind";
import styles from "./SearchForm.module.scss";

const cx = classNames.bind(styles);

function SearchForm({
	searchQuery,
	handleInputChange,
	handleSearch,
	handleClear,
	handleGetLocation,
	handleSuggestionClick,
	suggestions,
	showSuggestions,
	setShowSuggestions,
	loading,
	t,
}) {
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
	}, [setShowSuggestions]);

	const getCountryFlag = (countryCode) => {
		const Flag = Flags[countryCode];
		return Flag ? <Flag className={cx("country-flag")} /> : null;
	};

	return (
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
								<span>{suggestion.fullName}</span>
								{getCountryFlag(suggestion.country)}
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
				className={cx("search-button", { loading })}
				disabled={loading}
			>
				{t("home.searchButton")}
			</button>
		</form>
	);
}

export default SearchForm;
