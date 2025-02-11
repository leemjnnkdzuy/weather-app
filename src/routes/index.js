//Layouts
import NoHeaderLayout from "../layouts/NoHeaderLayout";
import DefaultLayout from "../layouts/DefaultLayout";

//Pages
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";

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
];

export { publicRoutes };
