module.exports = function extendMessage(message, client) {
	message.client = client;

	message.channel = async () => client.extendChannel(message.channel_id, client);
	message.guild = async () => client.extendGuild(message.guild_id, client);
	message.me = async () => client.api.get(`/users/@me`);
	message.user = async () => client.extendUser(message.author, client);

	message.reply = async (replyContent) => {
		const payload = typeof replyContent === "string" ? { content: replyContent } : replyContent;
		client.checkMessagePayload(payload);
		const msg = await client.api.post(`/channels/${message.channel_id}/messages`, {
			...payload,
			message_reference: { message_id: message.id },
		});

		return client.extendMessage(msg, client);
	};

	message.edit = async (newContent) => {
		const payload = typeof newContent === "string" ? { content: newContent } : newContent;
		client.checkMessagePayload(payload);
		return client.api.patch(`/channels/${message.channel_id}/messages/${message.id}`, payload);
	};

	return message;
};
