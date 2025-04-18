module.exports = function extendChannel(channel, client) {
	channel.client = client;

	channel.send = async (content) => {
		client.debug("sendMessage called with:", { channel_id: channel.id, content });
		const payload = typeof content === "string" ? { content } : content;
		client.checkMessagePayload(payload);
		return client.api.post(`/channels/${channel.id}/messages`, payload);
	};

	channel.fetchMessages = async (limit = 50) => {
		client.debug("fetchMessages called with:", { channel_id: channel.id, limit });
		return client.api.get(`/channels/${channel.id}/messages?limit=${limit}`);
	};

	channel.delete = async () => {
		client.debug("deleteChannel called with:", { channel_id: channel.id });
		return client.api.delete(`/channels/${channel.id}`);
	};

	return channel;
};
