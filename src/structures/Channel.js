const Guild = require("./Guild");

module.exports = class Channel {
	constructor(data, client) {
		this.client = client;
		this.id = data.id;
		this.type = data.type;
		this.guild_id = data.guild_id || null;
		this.guild = this.client.cache._guild.has(this.guild_id)
			? this.client.cache._guild.get(this.guild_id)
			: new Guild({ id: this.guild_id }, this.client);
		this.position = data.position || null;
		this.permission_overwrites = data.permission_overwrites || null;
		this.name = data.name || null;
		this.topic = data.topic || null;
		this.nsfw = data.nsfw || false;
		this.last_message_id = data.last_message_id || null;
		this.bitrate = data.bitrate || null;
		this.user_limit = data.user_limit || null;
		this.rate_limit_per_user = data.rate_limit_per_user || null;
		this.recipients = data.recipients || [];
		this.icon = data.icon || null;
		this.owner_id = data.owner_id || null;
		this.application_id = data.application_id || null;
		this.managed = data.managed || false;
		this.parent_id = data.parent_id || null;
		this.last_pin_timestamp = data.last_pin_timestamp ? new Date(data.last_pin_timestamp) : null;
		this.rtc_region = data.rtc_region || null;
		this.video_quality_mode = data.video_quality_mode || null;
		this.message_count = data.message_count || null;
		this.member_count = data.member_count || null;
		this.thread_metadata = data.thread_metadata || null;
		this.member = data.member || null;
		this.default_auto_archive_duration = data.default_auto_archive_duration || null;
		this.permission = data.permission || null;
		this.flags = data.flags || null;
		this.total_message_sent = data.total_message_sent || null;
		this.available_tags = data.available_tags || null;
		this.applied_tags = data.applied_tags || null;
		this.default_reaction_emoji = data.default_reaction_emoji || null;
		this.default_thread_rate_limit_per_user = data.default_thread_rate_limit_per_user || null;
		this.default_sort_order = data.default_sort_order || null;
		this.default_forum_layout = data.default_forum_layout || null;
	}

	send = async (content) => {
		const Message = require("./Message");
		this.client.debug("sendMessage called with:", { channel_id: this.id, content });
		const payload = typeof content === "string" ? { content } : content;
		this.client.checkMessagePayload(payload);
		const chann = await this.client.api.post(`/channels/${this.id}/messages`, payload);
		return new Message(chann, this.client);
	};

	fetchMessages = async (limit = 50) => {
		this.client.debug("fetchMessages called with:", { channel_id: this.id, limit });
		return this.client.api.get(`/channels/${this.id}/messages?limit=${limit}`);
	};

	delete = async () => {
		this.client.debug("deleteChannel called with:", { channel_id: this.id });
		return this.client.api.delete(`/channels/${this.id}`);
	};
};
