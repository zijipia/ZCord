module.exports = function extendInteraction(interaction, client) {
	interaction.client = client;

	interaction.guild = async () => client.api.get(`/guilds/${interaction.guild_id}`);
	interaction.channel = async () => client.api.get(`/channels/${interaction.channel_id}`);
	interaction.user = async () => client.api.get(`/users/${interaction.user.id}`);

	interaction.reply = async (content) => {
		client.debug("sendInteractionResponse called with:", {
			interaction_id: interaction.id,
			interactionToken: interaction.token,
			content,
		});

		const payload = typeof content === "string" ? { content } : content;

		client.checkMessagePayload(payload);

		return client.api.post(`/interactions/${interaction.id}/${interaction.token}/callback`, {
			type: 4,
			data: payload,
		});
	};

	return interaction;
};
