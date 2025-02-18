import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getAqiColor, getAqiBandSettings } from "../../../utils/formatters";

function AqiChart({ data, handleMouseMove, handleMouseLeave }) {
	const maxAqi =
		Math.ceil(Math.max(...data.map((point) => point.metrics.AQI_US.value)) / 100) *
		100;

	const chartConfig = {
		chart: {
			height: 250,
			type: "column",
			backgroundColor: "transparent",
			style: { fontFamily: "var(--font-family)" },
			events: {
				load: function () {
					const chart = this;
					chart.container.addEventListener("mousemove", (e) => handleMouseMove(e, chart));
					chart.container.addEventListener("mouseleave", handleMouseLeave);
				},
			},
		},
		title: { text: null },
		xAxis: {
			categories: data.map((point) => point.time),
			tickInterval: 8,
			reversed: false,
			labels: {
				style: { color: "var(--text-color)" },
			},
		},
		yAxis: {
			title: null,
			opposite: true,
			min: 0,
			max: maxAqi,
			tickInterval: 100,
			labels: {
				format: "{value}",
				style: { color: "var(--text-color)" },
			},
			plotBands: getAqiBandSettings().map((band) => ({
				...band,
				label: {
					...band.label,
					align: "left",
					x: 10,
					y: -3,
					style: {
						color: "var(--text-color)",
						fontSize: "12px",
					},
				},
			})),
			gridLineColor: "var(--border-color)",
		},
		plotOptions: {
			column: {
				borderRadius: 2,
				borderWidth: 0,
				states: { hover: { brightness: 0.1 } },
				pointPadding: 0.25,
				groupPadding: 0,
			},
		},
		credits: { enabled: false },
		tooltip: { enabled: false },
		series: [
			{
				name: "AQI US",
				data: data.map((point) => ({
					y: point.metrics.AQI_US.value,
					color: getAqiColor(point.metrics.AQI_US.value),
				})),
				zones: [
					{ value: 51, color: "#00e400" },
					{ value: 101, color: "#ffff00" },
					{ value: 151, color: "#ff7e00" },
					{ value: 201, color: "#ff0000" },
					{ value: 301, color: "#8f3f97" },
					{ color: "#7e0023" },
				],
			},
		],
	};

	return (
		<HighchartsReact
			highcharts={Highcharts}
			options={chartConfig}
			containerProps={{ style: { height: "100%" } }}
		/>
	);
}

export default AqiChart;
