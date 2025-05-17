module.exports = function checkMessagePayload(payload) {
	if (!payload) throw new Error("Payload is required.");
	if (typeof payload !== "object") payload = { content: payload };
	if (!payload.content && !payload.embeds && !payload.files && !payload.components)
		throw new Error("Payload must contain content, embeds, or files.");
	if (payload.embeds && !Array.isArray(payload.embeds)) throw new Error("Embeds must be an array.");
	if (payload.files && !Array.isArray(payload.files)) throw new Error("Files must be an array.");
	if (payload.components && !Array.isArray(payload.components)) throw new Error("Components must be an array.");
	return payload;
};
