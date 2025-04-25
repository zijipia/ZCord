const Channel = require("../structures/Channel");
/**
 * Fetches a channel by its ID.
 * @param {string} channel_id - The ID of the channel to fetch.
 * @param {require("./../").Client} client - The client instance.
 * @returns {Promise<Channel>} - A promise that resolves to the fetched channel.
 * @throws {Error} - Throws an error if the channel ID is not provided or if the channel cannot be fetched.
 */
module.exports = async function getChannel(channel_id, cache, client) {
	client.debug("getChannel called with:", channel_id);

	if (!channel_id) throw new Error("Channel ID is required.");

	if (client.cache._channel.has(channel_id) && cache) return client.cache._channel.get(channel_id);

	const channel = await client.api.get(`/channels/${channel_id}`);

	const extended = new Channel(channel);
	client.cache._channel.set(channel_id, extended);
	return extended;
};
