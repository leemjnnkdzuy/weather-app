import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getTemperatureColor } from "../../../utils/formatters";

function TemperatureChart({ data, handleMouseMove, handleMouseLeave }) {
	const chartConfig = {
		chart: {
			height: 250,
			type: "spline",
			backgroundColor: "transparent",
			style: {
				fontFamily: "var(--font-family)",
				paddingTop: "10px",
			},
			events: {
				load: function () {
					const chart = this;
					const boundMouseMove = (e) => handleMouseMove(e, chart, "TEMPERATURE");
					chart.container.addEventListener("mousemove", boundMouseMove);
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
				style: {
					color: "var(--text-color)",
				},
			},
		},
		yAxis: {
			title: null,
			opposite: true,
			min: -10,
			max: 45,
			tickInterval: 10,
			labels: {
				format: "{value}°C",
				style: {
					color: "var(--text-color)",
				},
			},
			plotBands: [
				{
					from: -10,
					to: 0,
					color: "rgba(0, 0, 255, 0.1)",
					label: {
						text: "Rất lạnh",
						align: "left",
						x: 10,
						y: -3,
						style: {
							color: "var(--text-color)",
							fontSize: "12px",
						},
					},
				},
				{
					from: 0,
					to: 10,
					color: "rgba(0, 191, 255, 0.1)",
					label: {
						text: "Lạnh",
						align: "left",
						x: 10,
						y: -3,
						style: {
							color: "var(--text-color)",
							fontSize: "12px",
						},
					},
				},
				{
					from: 10,
					to: 20,
					color: "rgba(144, 238, 144, 0.1)",
					label: {
						text: "Mát mẻ",
						align: "left",
						x: 10,
						y: -3,
						style: {
							color: "var(--text-color)",
							fontSize: "12px",
						},
					},
				},
				{
					from: 20,
					to: 25,
					color: "rgba(255, 215, 0, 0.1)",
					label: {
						text: "Ấm áp",
						align: "left",
						x: 10,
						y: -3,
						style: {
							color: "var(--text-color)",
							fontSize: "12px",
						},
					},
				},
				{
					from: 25,
					to: 30,
					color: "rgba(255, 165, 0, 0.1)",
					label: {
						text: "Nóng",
						align: "left",
						x: 10,
						y: -3,
						style: {
							color: "var(--text-color)",
							fontSize: "12px",
						},
					},
				},
				{
					from: 30,
					to: 45,
					color: "rgba(255, 69, 0, 0.1)",
					label: {
						text: "Rất nóng",
						align: "left",
						x: 10,
						y: -3,
						style: {
							color: "var(--text-color)",
							fontSize: "12px",
						},
					},
				},
			],
			gridLineColor: "var(--border-color)",
		},
		credits: { enabled: false },
		tooltip: { enabled: false },
		plotOptions: {
			spline: {
				lineWidth: 2,
				marker: {
					enabled: true,
					radius: 4,
					symbol: "circle",
				},
				states: {
					hover: {
						enabled: false,
					},
				},
			},
		},
		series: [
			{
				name: "Temperature",
				data: data.map((point) => ({
					x: data.indexOf(point),
					y: parseFloat(Number(point.metrics.TEMPERATURE.value).toFixed(1)),
					color: getTemperatureColor(parseFloat(point.metrics.TEMPERATURE.value)),
					marker: {
						fillColor: getTemperatureColor(parseFloat(point.metrics.TEMPERATURE.value)),
					},
				})),
				zones: [
					{ value: 0, color: "#0000FF" },
					{ value: 10, color: "#00BFFF" },
					{ value: 20, color: "#90EE90" },
					{ value: 25, color: "#FFD700" },
					{ value: 30, color: "#FFA500" },
					{ color: "#FF4500" },
				],
			},
		],
	};

	return <HighchartsReact highcharts={Highcharts} options={chartConfig} />;
}

export default TemperatureChart;
