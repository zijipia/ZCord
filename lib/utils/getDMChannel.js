module.exports = async function getDMChannel(user_id, cache, client) {
	client.debug("getChannel called with:", user_id);

	if (!user_id) throw new Error("Channel ID is required.");

	if (client.cache._DMchannel.has(user_id) && cache) return client.cache._DMchannel.get(user_id);

	const dmChannel = await client.api.post(`/users/@me/channels`, {
		recipient_id: user_id,
	});

	const extended = client.extendChannel(dmChannel);
	client.cache._DMchannel.set(user_id, extended);
	return extended;
};
