import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GlobalStyles from "./GlobalStyles";
import { ThemeProvider } from "./utils/ThemeContext";
import { publicRoutes } from "./routes";

function App() {
	return (
		<Router>
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
