module.exports = function extendMessage(message, client) {
	message.client = client;

	message.channel = client.getChannel(message.channel_id);
	message.guild = client.getGuild(message.guild_id ?? message?.message_reference?.guild_id);
	message.user = client.getUser(message.author?.id);

	message.reply = async (replyContent) => {
		const payload = typeof replyContent === "string" ? { content: replyContent } : replyContent;
		client.checkMessagePayload(payload);
		const msg = await client.api.post(`/channels/${message.channel_id}/messages`, {
			...payload,
			message_reference: { message_id: message.id },
		});
		return client.extendMessage(msg);
	};

	message.edit = async (newContent) => {
		const payload = typeof newContent === "string" ? { content: newContent } : newContent;
		client.checkMessagePayload(payload);
		return client.api.patch(`/channels/${message.channel_id}/messages/${message.id}`, payload);
	};

	return message;
};
