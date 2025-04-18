module.exports = async function getGuild(guild_id, client) {
	const guild = await client.guilds.fetch(guild_id);
	if (!guild) throw new Error(`Guild with ID ${guild_id} not found.`);
	if (client.cache._guild.has(guild_id)) return client.cache._guild.get(guild_id);
	const extended = client.extendGuild(guild);
	client.cache._guild.set(guild_id, extended);
	return extended;
};
