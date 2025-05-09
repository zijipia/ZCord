const User = require("./User");

module.exports = class Me extends User {
	#client;
	constructor(data, client) {
		super(data, client);
		this.#client = client;
		this._update(data);
	}

	_update(data) {
		if (data.username) this.username = data.username;
		if (data.discriminator) this.discriminator = data.discriminator;
		if (data.avatar) this.avatar = data.avatar;
		if (data.banner) this.banner = data.banner;
		if (data.accent_color) this.accent_color = data.accent_color;
		if (data.public_flags) this.public_flags = data.public_flags;
		if (data.flags) this.flags = data.flags;
		if (data.premium_type) this.premium_type = data.premium_type;
	}

	/**
	 *
	 * @param {object} data - The data to update the voice state with.
	 * @param {string} data.channel_id - The ID of the channel to join or leave.
	 * @param {string} data.guild_id - The ID of the guild to join or leave.
	 * @param {boolean} data.self_mute - Whether the user is muted.
	 * @param {boolean} data.self_deaf - Whether the user is deafened.
	 * @returns {Promise<Me>} - The updated Me instance.
	 */

	async voiceState(data) {
		const { channel_id, guild_id, self_mute, self_deaf } = data;
		this.#client.debug("voiceState called with:", channel_id, guild_id, self_mute, self_deaf);
		if (!guild_id) throw new Error("Guild ID is required.");
		await this.#client.ws.send({
			op: 4,
			d: {
				guild_id,
				channel_id,
				self_mute: !!self_mute,
				self_deaf: !!self_deaf,
			},
		});

		return this;
	}
	async edit(data) {
		const { username, avatar, banner, accent_color } = data;
		this.#client.debug("edit called with:", username, avatar, banner, accent_color);
		if (!username && !avatar && !banner && !accent_color) throw new Error("At least one field is required.");
		const payload = {
			accent_color,
		};
		await this.#client.api.patch("/users/@me", payload);
		this._update(payload);
		return this;
	}

	async presence(data) {
		const { activities, status, since, afk } = data;
		this.#client.debug("presence called with:", activities, status, since, afk);
		if (!activities && !status && !since && !afk) throw new Error("At least one field is required.");
		const payload = {
			activities,
			status,
			since,
			afk,
		};
		await this.#client.ws.send({
			op: 3,
			d: payload,
		});
		return this;
	}
};
