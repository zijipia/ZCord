const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const { URL } = require("url");

class Attachment {
	name;
	file;
	description;

	constructor(filePathOrBuffer, data = {}) {
		const { name, description } = data;

		if (Buffer.isBuffer(filePathOrBuffer)) {
			this.name = name || "untitled";
			this.file = filePathOrBuffer;
			this.description = description || null;
		} else if (typeof filePathOrBuffer === "string") {
			if (this.isUrl(filePathOrBuffer)) {
				// Async load from URL
				throw new Error("Use `Attachment.fromUrl()` to create Attachment from URL");
			} else {
				this.name = name || path.basename(filePathOrBuffer);
				this.description = description || null;
				if (!fs.existsSync(filePathOrBuffer)) {
					throw new Error(`File not found: ${filePathOrBuffer}`);
				}
				this.file = fs.readFileSync(filePathOrBuffer);
			}
		} else {
			throw new Error("Invalid input. Must be a file path, Buffer, or URL.");
		}
	}

	static async fromUrl(url, data = {}) {
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error(`Failed to fetch file from URL: ${url}`);
		}
		const buffer = Buffer.from(await res.arrayBuffer());
		const filename = data.name || path.basename(new URL(url).pathname);
		return new Attachment(buffer, { ...data, name: filename });
	}

	isUrl(str) {
		return /^https?:\/\//.test(str);
	}

	toJSON() {
		return {
			name: this.name,
			description: this.description,
			file: this.file,
		};
	}
}

module.exports = Attachment;
