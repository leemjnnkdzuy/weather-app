import classNames from "classnames/bind";
import styles from "./AQILegend.module.scss";

const cx = classNames.bind(styles);

function AQILegend() {
	const legends = [
		{ range: "0-50", label: "Tốt", class: "bg-green" },
		{ range: "51-100", label: "Trung bình", class: "bg-yellow" },
		{
			range: "101-150",
			label: "Không tốt cho các nhóm nhạy cảm",
			class: "bg-orange",
		},
		{ range: "151-200", label: "Không lành mạnh", class: "bg-red" },
		{ range: "201-300", label: "Rất không tốt", class: "bg-purple" },
		{ range: "301+", label: "Nguy hiểm", class: "bg-maroon" },
	];

	return (
		<div className={cx("wrapper")}>
			{legends.map((item) => (
				<div key={item.range} className={cx("aqi-legend", item.class)}>
					<p className={cx("aqi-legend-range")}>{item.range}</p>
					<p className={cx("aqi-legend-label")}>{item.label}</p>
				</div>
			))}
		</div>
	);
}

export default AQILegend;
