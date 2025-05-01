const User = require("./User");
const Guild = require("./Guild");

module.exports = class Member extends User {
	#client;
	constructor(data, client) {
		super(data.user, client);
		this.#client = client;
		this.guild_id = data.guild_id;
		this.guild = this.#client.cache._guild.has(data.guild_id)
			? this.#client.cache._guild.get(data.guild_id)
			: new Guild({ id: data.guild_id }, this.#client);
		this.guild = this.nick = data.nick || null;
		this.channel_id = data.channel_id || null;
		this.roles = data.roles || [];
		this.nick = data.nick || null;
		this.joinedAt = data.joined_at ? new Date(data.joined_at) : null;
		this.premiumSince = data.premium_since ? new Date(data.premium_since) : null;
		this.deaf = data.deaf || false;
		this.mute = data.mute || false;
		this.pending = data.pending || false;
	}
	async edit({ nick, reason, roles, mute, deaf, channel_id, communication_disabled_until, flags }) {
		const rawOptions = {
			nick,
			roles,
			mute,
			deaf,
			channel_id,
			communication_disabled_until,
			flags,
		};

		const options = {};
		for (const [key, value] of Object.entries(rawOptions)) {
			if (value !== undefined) {
				options[key] = value;
			}
		}

		const stat = await this.#client.api.patch(`/guilds/${this.guild_id}/members/${this.id}`, options, { reason });

		if (stat) {
			if (nick !== undefined) this.nick = nick;
			if (deaf !== undefined) this.deaf = deaf;
			if (mute !== undefined) this.mute = mute;
			if (channel_id !== undefined) this.channel_id = channel_id;
			if (communication_disabled_until !== undefined) this.communication_disabled_until = communication_disabled_until;
			if (flags !== undefined) this.flags = flags;
			return this;
		}

		throw new Error("Failed to edit member");
	}
};
