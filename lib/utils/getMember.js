const Member = require("../structures/Member");

module.exports = async function getMember(guild_id, user_id, cache, client) {
	client.debug("getMember called with:", guild_id, user_id);

	if (!guild_id) throw new Error("Guild ID is required.");
	if (!user_id) throw new Error("User ID is required.");

	const key = `${guild_id}:${user_id}`;
	if (client.cache._member.has(key) && cache) return client.cache._member.get(key);

	const data = await client.api.get(`/guilds/${guild_id}/members/${user_id}`);
	const extended = new Member(data, client);
	client.cache._member.set(key, extended);
	return extended;
};
