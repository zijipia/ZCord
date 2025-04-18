module.exports = async function getChannel(channel_id, client) {
	client.debug("getChannel called with:", channel_id);

	if (!channel_id) throw new Error("Channel ID is required.");

	if (client.cache._channel.has(channel_id)) return client.cache._channel.get(channel_id);

	const channel = await client.api.get(`/channels/${channel_id}`);

	const extended = client.extendChannel(channel);
	client.cache._channel.set(channel_id, extended);
	return extended;
};
