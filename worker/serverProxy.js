export default {
	async fetch(request, env) {
		if (request.method === "OPTIONS") {
			return new Response(null, {
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, OPTIONS",
					"Access-Control-Allow-Headers": "*",
					"Access-Control-Max-Age": "86400",
				},
			});
		}

		const url = new URL(request.url);

		if (url.pathname === "/") {
			return new Response("SERVER IS ON", {
				headers: {
					"Content-Type": "text/plain",
					"Access-Control-Allow-Origin": "*",
				},
			});
		}

		if (url.pathname === "/rankings") {
			const AIRVISUAL_API = "https://website-api.airvisual.com/v1";
			const params = new URLSearchParams(url.search);

			const page = Math.min(
				Math.max(parseInt(params.get("page") || "1", 10), 1),
				100
			);
			const perPage = Math.min(
				Math.max(parseInt(params.get("perPage") || "50", 10), 1),
				100
			);
			const language = params.get("language") || "en";

			const targetUrl = `${AIRVISUAL_API}/countries/rankings?sortBy=aqi&sortOrder=desc&page=${page}&perPage=${perPage}&display=full&units.temperature=celsius&units.distance=kilometer&units.pressure=millibar&units.system=metric&AQI=US&language=${language}`;

			try {
				const response = await fetch(targetUrl);
				const data = await response.json();

				return new Response(JSON.stringify(data), {
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
						"Cache-Control": "max-age=300",
					},
				});
			} catch (error) {
				return new Response(
					JSON.stringify({
						error: "Failed to fetch rankings data",
						details: error.message,
					}),
					{
						status: 500,
						headers: {
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "*",
						},
					}
				);
			}
		}

		if (url.pathname.startsWith("/cities/")) {
			const AIRVISUAL_API = "https://website-api.airvisual.com/v1";
			const urlParams = new URLSearchParams(url.search);
			const language = urlParams.get("language") || "en";

			const params = new URLSearchParams({
				"units.temperature": "celsius",
				"units.distance": "kilometer",
				"units.pressure": "millibar",
				"units.system": "metric",
				AQI: "US",
				language: language,
			});

			const targetUrl = `${AIRVISUAL_API}${url.pathname}?${params.toString()}`;

			try {
				const response = await fetch(targetUrl);
				const data = await response.json();

				return new Response(JSON.stringify(data), {
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
						"Cache-Control": "max-age=300",
					},
				});
			} catch (error) {
				return new Response(
					JSON.stringify({
						error: "Failed to fetch city data",
						details: error.message,
					}),
					{
						status: 500,
						headers: {
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "*",
						},
					}
				);
			}
		}

		const AIRVISUAL_API = "https://website-api.airvisual.com/v1";
		const targetUrl = `${AIRVISUAL_API}${url.pathname}${url.search}`;

		try {
			const response = await fetch(targetUrl);
			const data = await response.json();

			return new Response(JSON.stringify(data), {
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					"Cache-Control": "max-age=300",
				},
			});
		} catch (error) {
			return new Response(
				JSON.stringify({
					error: error.message || "Failed to fetch data",
				}),
				{
					status: 500,
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					},
				}
			);
		}
	},
};
