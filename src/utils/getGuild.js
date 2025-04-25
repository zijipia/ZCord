const Guild = require("../structures/Guild");

module.exports = async function getGuild(guild_id, cache, client) {
	if (!guild_id) return null;
	if (client.cache._guild.has(guild_id) && cache) return client.cache._guild.get(guild_id);

	client.debug("getGuild called with:", guild_id);
	const guild = await client.api.get(`/guilds/${guild_id}`);

	const extended = new Guild(guild, client);
	client.cache._guild.set(guild_id, extended);
	return extended;
};
