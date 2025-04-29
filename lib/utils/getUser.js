const User = require("../structures/User");
module.exports = async function getUser(user_id, cache, client) {
	client.debug("getUser called with:", user_id);

	if (!user_id) throw new Error("User ID is required.");

	if (client.cache._user.has(user_id) && cache) return client.cache._user.get(user_id);

	const user = await client.api.get(`/users/${user_id}`);
	const extended = new User(user, client);
	client.cache._user.set(user_id, extended);
	return extended;
};
