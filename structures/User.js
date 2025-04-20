module.exports = function extendUser(user, client) {
	user.getAvatarURL = (size = 1024) => {
		if (!user.avatar) return null;
		if (user.avatar.startsWith("a_")) {
			return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif?size=${size}`;
		}

		return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=${size}`;
	};
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

	return user;
};
