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
			return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
				status: 500,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
			});
		}
	},
};
