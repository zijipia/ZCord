module.exports = async function getMessage(message_id, channel_id, client) {
	client.debug("getMessage called with:", { message_id, channel_id });

	if (!message_id || !channel_id) throw new Error("Message ID and Channel ID are required.");

	if (client.cache._channel.has(channel_id)) {
		const channel = client.cache._channel.get(channel_id);
		if (channel.cache._message.has(message_id)) return channel.cache._message.get(message_id);
	}

	const message = await client.api.get(`/channels/${channel_id}/messages/${message_id}`);
	const extended = client.extendMessage(message);
	client.cache._channel.get(channel_id).cache._message.set(message_id, extended);
	return extended;
};
