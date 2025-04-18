module.exports = async function getUser(user_id, client) {
	client.debug("getUser called with:", user_id);

	if (!user_id) throw new Error("User ID is required.");

	if (client.cache._user.has(user_id)) return client.cache._user.get(user_id);

	const user = await client.api.get(`/users/${user_id}`);
	const extended = client.extendUser(user, client);
	client.cache._user.set(user_id, extended);
	return extended;
};
