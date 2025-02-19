//Layouts
import NoHeaderLayout from "../layouts/NoHeaderLayout";
import DefaultLayout from "../layouts/DefaultLayout";

//Pages
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import WorldAirQualityRanking from "../pages/WorldAirQualityRanking";
import AirQualityPages from "../pages/AirQualityPages";

const publicRoutes = [
	{
		path: "/",
		component: Home,
		layout: DefaultLayout,
	},
	{
		path: "*",
		component: NotFound,
		layout: NoHeaderLayout,
	},
	{
		path: "/world-air-quality-ranking",
		component: WorldAirQualityRanking,
		layout: DefaultLayout,
	},
	{
		path: "/air-quality/:cityId",
		component: AirQualityPages,
		layout: DefaultLayout,
	},
];

export { publicRoutes };
