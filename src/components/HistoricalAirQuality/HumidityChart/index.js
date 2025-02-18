import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getHumidityColor } from "../../../utils/formatters";

function HumidityChart({ data, handleMouseMove, handleMouseLeave }) {
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
					const boundMouseMove = (e) => handleMouseMove(e, chart, "HUMIDITY");
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
			min: 0,
			max: 100,
			tickInterval: 20,
			labels: {
				format: "{value}%",
				style: {
					color: "var(--text-color)",
				},
			},
			plotBands: [
				{
					from: 0,
					to: 30,
					color: "rgba(255, 182, 193, 0.1)",
					label: {
						text: "Khô",
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
					to: 70,
					color: "rgba(144, 238, 144, 0.1)",
					label: {
						text: "Bình thường",
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
					from: 70,
					to: 100,
					color: "rgba(135, 206, 235, 0.1)",
					label: {
						text: "Ẩm",
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
		},
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
		credits: { enabled: false },
		tooltip: { enabled: false },
		series: [
			{
				name: "Humidity",
				data: data.map((point) => ({
					x: data.indexOf(point),
					y: parseFloat(Number(point.metrics.HUMIDITY.value).toFixed(1)),
					color: getHumidityColor(parseFloat(point.metrics.HUMIDITY.value)),
					marker: {
						fillColor: getHumidityColor(parseFloat(point.metrics.HUMIDITY.value)),
					},
				})),
				zones: [
					{ value: 30, color: "#FF4500" },
					{ value: 40, color: "#FFA500" },
					{ value: 50, color: "#FFD700" },
					{ value: 60, color: "#90EE90" },
					{ value: 80, color: "#00BFFF" },
					{ color: "#0000FF" },
				],
			},
		],
	};

	return <HighchartsReact highcharts={Highcharts} options={chartConfig} />;
}

export default HumidityChart;
