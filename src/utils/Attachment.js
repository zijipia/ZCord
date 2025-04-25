const fs = require("fs");
const path = require("path");

class Attachment {
	name;
	file;

	constructor(filePathOrBuffer, data = {}) {
		const { name, description } = data;
		if (Buffer.isBuffer(filePathOrBuffer)) {
			this.name = name || "untitled";
			this.file = filePathOrBuffer;
			this.description = description || null;
		} else if (typeof filePathOrBuffer === "string") {
			this.name = name || path.basename(filePathOrBuffer);
			this.description = description || null;
			if (!fs.existsSync(filePathOrBuffer)) {
				throw new Error(`File not found: ${filePathOrBuffer}`);
			}
			this.file = fs.readFileSync(filePathOrBuffer);
		} else {
			throw new Error("Invalid input. Must be a file path or Buffer.");
		}
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
