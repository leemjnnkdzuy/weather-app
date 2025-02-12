import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GlobalStyles from "./GlobalStyles";
import { ThemeProvider } from "./utils/ThemeContext";
import { publicRoutes } from "./routes";
import "./i18n";

const routerOptions = {
	future: {
		v7_startTransition: true,
		v7_relativeSplatPath: true,
	},
};

function App() {
	return (
		<Router future={routerOptions.future}>
			<ThemeProvider>
				<GlobalStyles>
					<div className="App">
						<Routes>
							{publicRoutes.map((route, index) => {
								const Page = route.component;
								const Layout = route.layout;

								return (
									<Route
										key={index}
										path={route.path}
										element={
											<Layout>
												<Page />
											</Layout>
										}
									/>
								);
							})}
						</Routes>
					</div>
				</GlobalStyles>
			</ThemeProvider>
		</Router>
	);
}

export default App;
