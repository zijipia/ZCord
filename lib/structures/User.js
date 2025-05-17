const Channel = require("./Channel");

module.exports = class User {
	#client;
	constructor(data, client) {
		this.#client = client;
		this.id = data?.id;
		this.username = data?.username;
		this.discriminator = data?.discriminator;
		this.global_name = data?.global_name;
		this.avatar = data?.avatar;
		this.bot = data.bot || false;
		this.system = data.system || false;
		this.mfa_enabled = data.mfa_enabled || false;
		this.banner = data.banner || null;
		this.accent_color = data.accent_color || null;
		this.locale = data.locale || null;
		this.verified = data.verified || false;
		this.email = data.email || null;
		this.flags = data.flags || null;
		this.premium_type = data.premium_type || null;
		this.public_flags = data.public_flags || null;
		this.avatar_decoration_data = data.avatar_decoration_data || null;
	}

	getAvatarURL = (opt = { size: 1024, gif: true }) => {
		if (!this.avatar) return null;
		if (this.avatar.startsWith("a_") && !!opt.gif) {
			return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.gif?size=${opt.size ?? 1024}`;
		}

		return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png?size=${opt.size ?? 1024}`;
	};

	send = async (content) => {
		this.#client.debug("sendDM called with:", { user_id: this.id, content });
		const dm = await this.#client.api.post(`/users/@me/channels`, {
			recipient_id: this.id,
		});
		const dmChannel = new Channel(dm, this.#client);
		const payload = typeof content === "string" ? { content } : content;
		this.#client.checkMessagePayload(payload);
		return dmChannel.send(payload);
	};
};
