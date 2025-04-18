module.exports = function extendUser(user, client) {
	user.client = client;

	user.send = async (content) => {
		client.debug("sendDM called with:", { user_id: user.id, content });
		const dm = await client.api.post(`/users/@me/channels`, {
			recipient_id: user.id,
		});
		const dmChannel = await client.extendChannel(dm);
		payload = typeof content === "string" ? { content } : content;
		client.checkMessagePayload(payload);
		return dmChannel.send(payload);
	};

	user.fetch = async () => {
		client.debug("getUser called with:", { user_id: user.id });
		if (client.cache._user.has(user.id)) {
			return client.cache._user.get(user.id);
		}
		const fetchedUser = await client.api.get(`/users/${user.id}`);
		client.cache._user.set(user.id, fetchedUser);
		return fetchedUser;
	};

	return user;
};
