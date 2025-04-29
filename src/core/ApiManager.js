const fetch = require("node-fetch");
const FormData = require("form-data");

class FormDataBuilder {
	constructor() {
		this.form = new FormData();
		this.attachments = [];
		this.fileIndex = 0;
	}
	addFile({ file, name, description = null, contentType = null }) {
		const index = this.fileIndex++;
		this.form.append(`files[${index}]`, file, { filename: name, contentType: contentType || null });
		this.attachments.push({
			id: index,
			filename: name,
			description: description || undefined,
		});
	}
	setPayloadJson(payload) {
		if (this.attachments.length > 0) {
			payload.attachments = this.attachments;
		}
		this.form.append("payload_json", JSON.stringify(payload));
	}
	build() {
		return this.form;
	}
	headers() {
		return this.form.getHeaders();
	}
}

class ApiManager {
	#headers;
	constructor(client, token) {
		this.client = client;
		this.#headers = { Authorization: `Bot ${token}`, "Content-Type": "application/json" };
	}

	async request(url, method, body) {
		this.client.debug("Making API request", { url, method, body });

		try {
			let options = { method, headers: { ...this.#headers } };

			if (body?.files?.length) {
				const formDataBuilder = new FormDataBuilder();

				for (const file of body.files) {
					this.client.debug("Adding file to form data:", file.name);
					formDataBuilder.addFile({
						file: file.file,
						name: file.name,
						description: file.description,
					});
				}

				const payload = { ...body };
				delete payload.files;

				formDataBuilder.setPayloadJson(payload);
				options.body = formDataBuilder.build();

				delete options.headers["Content-Type"];
				options.headers = Object.assign(options.headers, formDataBuilder.headers());
			} else if (body) {
				options.body = JSON.stringify(body);
				options.headers["Content-Type"] = "application/json";
			}

			const response = await fetch(url, options);
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
