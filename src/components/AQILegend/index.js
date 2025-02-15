import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./AQILegend.module.scss";

const cx = classNames.bind(styles);

function AQILegend({ onRangeSelect, selectedRanges }) {
	const [isSticky, setIsSticky] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const offset = window.scrollY;
			setIsSticky(offset > 80);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const legends = [
		{ range: "0-50", label: "Tốt", class: "bg-green", min: 0, max: 50 },
		{ range: "51-100", label: "Trung bình", class: "bg-yellow", min: 51, max: 100 },
		{
			range: "101-150",
			label: "Không tốt cho các nhóm nhạy cảm",
			class: "bg-orange",
			min: 101,
			max: 150,
		},
		{
			range: "151-200",
			label: "Không lành mạnh",
			class: "bg-red",
			min: 151,
			max: 200,
		},
		{
			range: "201-300",
			label: "Rất không tốt",
			class: "bg-purple",
			min: 201,
			max: 300,
		},
		{
			range: "301+",
			label: "Nguy hiểm",
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
