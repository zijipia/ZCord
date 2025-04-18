module.exports = function extendGuild(guild, client) {
	guild.client = client;

	guild.getChannels = async () => {
		if (client.cache._channel.has(guild.id)) {
			return client.cache._channel.get(guild.id);
		}
		const channels = await client.api.get(`/guilds/${guild.id}/channels`);
		client.cache._channel.set(guild.id, channels);
		return channels;
	};

	guild.getMembers = async (limit = 1000) => {
		if (client.cache._member.has(guild.id)) {
			return client.cache._member.get(guild.id);
		}
		const members = await client.api.get(`/guilds/${guild.id}/members?limit=${limit}`);
		client.cache._member.set(guild.id, members);
		return members;
	};

	guild.leave = async () => {
		return client.api.delete(`/users/@me/guilds/${guild.id}`);
	};

	guild.banMember = async (user_id, reason) => {
		return client.api.put(`/guilds/${guild.id}/bans/${user_id}`, { reason });
	};

	guild.unbanMember = async (user_id) => {
		return client.api.delete(`/guilds/${guild.id}/bans/${user_id}`);
	};

	return guild;
};
