import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./AQILegend.module.scss";
import { useTranslation } from "react-i18next";

const cx = classNames.bind(styles);

function AQILegend({ onRangeSelect, selectedRanges }) {
	const [isSticky, setIsSticky] = useState(false);
	const { t } = useTranslation();

	useEffect(() => {
		const handleScroll = () => {
			const offset = window.scrollY;
			setIsSticky(offset > 80);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const legends = [
	{
		range: "0-50",
		label: t("airQualityRanking.quality.good"),
		class: "bg-green",
		min: 0,
		max: 50,
	},
	{
		range: "51-100",
		label: t("airQualityRanking.quality.moderate"),
		class: "bg-yellow",
		min: 51,
		max: 100,
	},
	{
		range: "101-150",
		label: t("airQualityRanking.quality.unhealthySensitive"),
		class: "bg-orange",
		min: 101,
		max: 150,
	},
	{
		range: "151-200",
		label: t("airQualityRanking.quality.unhealthy"),
		class: "bg-red",
		min: 151,
		max: 200,
	},
	{
		range: "201-300",
		label: t("airQualityRanking.quality.veryUnhealthy"),
		class: "bg-purple",
		min: 201,
		max: 300,
	},
	{
		range: "301+",
		label: t("airQualityRanking.quality.hazardous"),
		class: "bg-maroon",
		min: 301,
		max: Infinity,
	},
];

	return (
		<div className={cx("wrapper", { sticky: isSticky })}>
			{legends.map((item) => (
				<div
					key={item.range}
					className={cx("aqi-legend", item.class, {
						active: selectedRanges.includes(item.range),
					})}
					onClick={() => onRangeSelect(item.range)}
				>
					<p className={cx("aqi-legend-range")}>{item.range}</p>
					<p className={cx("aqi-legend-label")}>{item.label}</p>
				</div>
			))}
		</div>
	);
}

export default AQILegend;
