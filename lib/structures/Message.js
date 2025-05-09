const User = require("./User");
const Guild = require("./Guild");
const Channel = require("./Channel");

module.exports = class Message {
	constructor(data, client) {
		this.client = client;
		this.id = data.id;
		this.guild_id = data.guild_id;
		this.guild = this.client.cache._guild.get(data.guild_id)
			? client.cache._guild.get(this.guild_id)
			: new Guild({ id: data.guild_id }, this.client);
		this.channel_id = data.channel_id;
		this.channel = this.client.cache._channel.has(data.channel_id)
			? this.client.cache._channel.get(data.channel_id)
			: new Channel({ id: data.channel_id }, this.client);
		this.author = data.author || data.user;
		this.user = new User(data.author || data.user, this.client);
		this.content = data.content;
		this.timestamp = new Date(data.timestamp);
		this.edited_timestamp = data.edited_timestamp ? new Date(data.edited_timestamp) : null;
		this.tts = data.tts;
		this.mention_everyone = data.mention_everyone || false;
		this.mentions = data.mentions || [];
		this.mention_roles = data.mention_roles || [];
		this.mention_channels = data.mention_channels || [];
		this.attachments = data.attachments || [];
		this.embeds = data.embeds || [];
		this.reactions = data.reactions || [];
		this.nonce = data.nonce || null;
		this.pinned = data.pinned || false;
		this.webhook_id = data.webhook_id || null;
		this.type = data.type || 0;
		this.activity = data.activity || null;
		this.application = data.application || null;
		this.application_id = data.application_id || null;
		this.flags = data.flags || 0;
		this.message_reference = data.message_reference
			? {
					type: data.message_reference.type || this.type,
					message_id: data.message_reference.message_id,
					channel_id: data.message_reference.channel_id,
					guild_id: data.message_reference.guild_id,
					fail_if_not_exists: data.message_reference.fail_if_not_exists,
			  }
			: null;
		this.message_snapshots = data.message_snapshots || [];
		this.referenced_message = data.referenced_message || null;
		this.interaction_metadata = data.interaction_metadata || null;
		this.interaction = data.interaction || null;
		this.thread = data.thread || null;
		this.components = data.components || [];
		this.sticker_items = data.sticker_items || [];
		this.sticker = data.sticker || null;
		this.position = data.position || null;
		this.role_subscription_data = data.role_subscription_data || null;
		this.resolved = data.resolved || null;
		this.poll = data.poll || null;
		this.call = data.call || null;
		this.message = data.message || null;
	}

	reply = async (replyContent) => {
		const payload = typeof replyContent === "string" ? { content: replyContent } : replyContent;
		this.client.checkMessagePayload(payload);
		const msg = await this.client.api.post(`/channels/${this.channel_id}/messages`, {
			...payload,
			message_reference: { message_id: this.id },
		});
		return new Message(msg, this.client);
	};

	edit = async (newContent) => {
		const payload = typeof newContent === "string" ? { content: newContent } : newContent;
		this.client.checkMessagePayload(payload);
		const msg = await this.client.api.patch(`/channels/${this.channel_id}/messages/${this.id}`, payload);
		return new Message(msg, this.client);
	};
};
