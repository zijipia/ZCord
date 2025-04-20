const fetch = require("node-fetch");

class ApiManager {
	#headers;
	constructor(client, token) {
		this.client = client;
		this.#headers = { Authorization: `Bot ${token}`, "Content-Type": "application/json" };
	}

	async request(url, method, body) {
		this.client.debug("Making API request", { url, method, body });
		try {
			const response = await fetch(url, {
				method,
				headers: this.#headers,
				body: body ? JSON.stringify(body) : undefined,
			});

			const data = response.status === 204 ? null : await response.json();

			if (!response.ok) {
				this.client.debug(`Error in ${method} ${url}:`, data);
				throw new Error(data?.message || "Request failed");
			}

			this.client.debug("API request successful", data);
			return data;
		} catch (error) {
			this.client.debug("API Request failed:", error.message);
			throw error;
		}
	}

	get(url) {
		return this.request(`https://discord.com/api/v10${url}`, "GET");
	}

	post(url, body) {
		return this.request(`https://discord.com/api/v10${url}`, "POST", body);
	}

	put(url, body) {
		return this.request(`https://discord.com/api/v10${url}`, "PUT", body);
	}

	patch(url, body) {
		return this.request(`https://discord.com/api/v10${url}`, "PATCH", body);
	}

	delete(url, body) {
		return this.request(`https://discord.com/api/v10${url}`, "DELETE", body);
	}
}

module.exports = ApiManager;
