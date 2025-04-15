const WebSocket = require("ws");
const fetch = require("node-fetch");
const EventEmitter = require("events");

module.exports = class Client extends EventEmitter {
	constructor(token, options = { _init: true, intents: 3276799 }) {
		super();
		this.token = token;
		this.user = null;
		this.guilds = null;
		this.ws = null;
		this.heartbeatInterval = null;
		this.sequenceNumber = null;
		this.gatewayUrl = "wss://gateway.discord.gg/?v=10&encoding=json";
		this.intents = options.intents;
		this.options = options;
		this.headers = {
			Authorization: `Bot ${this.token}`,
			"Content-Type": "application/json",
		};
		this.identifyProperties = {
			os: options.identifyProperties?.os || "linux",
			browser: options.identifyProperties?.browser || "node",
			device: options.identifyProperties?.device || "node",
		};
		this.isReady = false;
		if (options._init) this.connect();
	}

	debug(message, ...args) {
		if (this.listeners("debug").length > 0) this.emit("debug", `[DEBUG] ${message}`, ...args);
	}

	async connect(retries = 1) {
		this.debug("Connecting to Discord Gateway...");
		this.ws = new WebSocket(this.gatewayUrl);
		this.ws.on("open", () => {
			this.debug("WebSocket connection opened");
			this.identify();
		});
		this.ws.on("message", (data) => this.handleMessage(data));
		this.ws.on("close", (code, reason) => {
			this.debug("WebSocket closed with code:", code, "reason:", reason);
			clearInterval(this.heartbeatInterval);
			setTimeout(() => this.connect(retries + 1), Math.min(1000 * 2 ** retries, 60000));
		});
		this.ws.on("error", (error) => this.debug("WebSocket error:", error));
	}

	identify() {
		this.debug("Identifying bot...");
		this.ws.send(
			JSON.stringify({
				op: 2,
				d: {
					token: this.token,
					intents: this.intents,
					properties: {
						os: this.identifyProperties.os,
						browser: this.identifyProperties.browser,
						device: this.identifyProperties.device,
					},
				},
			}),
		);
	}

	heartbeat(interval) {
		this.debug("Starting heartbeat with interval:", interval);
		this.heartbeatInterval = setInterval(() => {
			this.debug("Sending heartbeat...");
			this.ws.send(JSON.stringify({ op: 1, d: this.sequenceNumber }));
		}, interval);
	}

	async handleMessage(data) {
		const { t: event, s: seq, op, d: payload } = JSON.parse(data);
		if (seq) this.sequenceNumber = seq;
		if (this.listeners("raw").length > 0) this.emit("raw", `[RAW] Received operation: ${op}: ${event}`, payload);
		switch (op) {
			case 10:
				this.heartbeat(payload.heartbeat_interval);
				break;
			case 11:
				this.debug("Heartbeat acknowledged");
				break;
		}

		switch (event) {
			case "MESSAGE_CREATE":
				this.emit("messageCreate", this.extendMessage(payload));
				break;
			case "INTERACTION_CREATE":
				this.emit("interactionCreate", this.extendInteraction(payload));
				break;
			case "READY":
				this.isReady = true;
				this.user = payload.user;
				this.guilds = payload.guilds;
				this.debug(`Logged in as ${this.user.username}`);
				this.emit("ready", payload);
				break;
			case "VOICE_STATE_UPDATE":
				this.emit("voiceStateUpdate", payload);
			case "VOICE_SERVER_UPDATE":
				this.emit("voiceServerUpdate", payload);
		}
	}

	async apiRequest(url, method, body) {
		this.debug("Making API request", { url, method, body });
		try {
			const response = await fetch(url, {
				method,
				headers: this.headers,
				body: JSON.stringify(body),
			});
			const data = response.status === 204 ? null : await response.json();

			if (!response.ok) {
				this.debug(`Error in ${method} ${url}:`, data);
				throw new Error(data?.message || "Request failed");
			}

			this.debug("API request successful", data);
			return data;
		} catch (error) {
			this.debug("API Request failed:", error.message);
			throw error;
		}
	}

	//#region Interaction
	async registerGlobalCommand(commandData) {
		this.debug("Registering global slash command", commandData);
		return this.apiRequest(`https://discord.com/api/v10/applications/${this.user.id}/commands`, "POST", commandData);
	}

	async registerGuildCommand(guild_id, commandData) {
		this.debug("Registering guild slash command", { guild_id, commandData });
		return this.apiRequest(
			`https://discord.com/api/v10/applications/${this.user.id}/guilds/${guild_id}/commands`,
			"POST",
			commandData,
		);
	}

	async getGlobalCommands() {
		this.debug("Fetching global slash commands...");
		return this.apiRequest(`https://discord.com/api/v10/applications/${this.user.id}/commands`, "GET");
	}

	async getGuildCommands(guild_id) {
		this.debug("Fetching guild slash commands for:", guild_id);
		return this.apiRequest(`https://discord.com/api/v10/applications/${this.user.id}/guilds/${guild_id}/commands`, "GET");
	}

	extendInteraction(interaction) {
		interaction.client = this;
		interaction.reply = async (content) => this.sendInteractionResponse(interaction.id, interaction.token, content);
		return interaction;
	}

	async sendInteractionResponse(interaction_id, interactionToken, content) {
		this.debug("sendInteractionResponse called with:", { interaction_id, interactionToken, content });

		return this.apiRequest(`https://discord.com/api/v10/interactions/${interaction_id}/${interactionToken}/callback`, "POST", {
			type: 4,
			data: content,
		});
	}

	//#endregion
	//#region Guild

	extendGuild(guild) {
		guild.client = this;
		guild.fetchChannels = async () => this.getGuildChannels(guild.id);
		guild.fetchMembers = async (limit = 1000) => this.getGuildMembers(guild.id, limit);
		guild.leave = async () => this.leaveGuild(guild.id);
		guild.fetch = async () => this.getGuild(guild.id);
		return guild;
	}

	async getGuild(guild_id) {
		this.debug("getGuild called with:", guild_id);
		if (!guild_id) throw new Error("Guild ID is required.");
		const guild = await this.apiRequest(`https://discord.com/api/v10/guilds/${guild_id}`, "GET");
		return this.extendGuild(guild);
	}
	async getGuildChannels(guild_id) {
		this.debug("getGuildChannels called with:", guild_id);
		return this.apiRequest(`https://discord.com/api/v10/guilds/${guild_id}/channels`, "GET");
	}

	async getGuildMembers(guild_id, limit = 1000) {
		this.debug("getGuildMembers called with:", { guild_id, limit });
		return this.apiRequest(`https://discord.com/api/v10/guilds/${guild_id}/members?limit=${limit}`, "GET");
	}

	async leaveGuild(guild_id) {
		this.debug("leaveGuild called with:", guild_id);
		return this.apiRequest(`https://discord.com/api/v10/users/@me/guilds/${guild_id}`, "DELETE");
	}

	//#endregion
	//#region Channel

	extendChannel(channel) {
		channel.client = this;
		channel.send = async (content) => this.sendMessage(channel.id, content);
		return channel;
	}

	async getChannel(channel_id) {
		this.debug("getChannel called with:", channel_id);
		if (!channel_id) throw new Error("Channel ID is required.");
		const channel = await this.apiRequest(`https://discord.com/api/v10/channels/${channel_id}`, "GET");
		return this.extendChannel(channel);
	}

	//#endregion
	//#region Message

	extendMessage(message) {
		message.client = this;
		message.reply = async (content) => this.replyMessage(message.id, message.channel_id, content);
		message.edit = async (content) => this.editMessage(message.id, message.channel_id, content);
		return message;
	}

	async getMessage(channel_id, message_id) {
		this.debug("getMessage called with:", { channel_id, message_id });
		if (!channel_id || !message_id) throw new Error("Channel ID and Message ID are required.");
		const message = await this.apiRequest(`https://discord.com/api/v10/channels/${channel_id}/messages/${message_id}`, "GET");
		this.extendMessage(message);
	}

	async sendMessage(channel_id, content) {
		this.debug("sendMessage called with:", { channel_id, content });
		return this.apiRequest(
			`https://discord.com/api/v10/channels/${channel_id}/messages`,
			"POST",
			typeof content === "string" ? { content } : content,
		);
	}

	async editMessage(message_id, channel_id, newContent) {
		this.debug("editMessage called with:", { message_id, channel_id, newContent });

		if (!channel_id || !message_id) {
			throw new Error("Invalid parameters: channel_id or message_id is undefined.");
		}

		const contentPayload = typeof newContent === "string" ? { content: newContent } : newContent;
		if (!contentPayload || typeof contentPayload.content !== "string") {
			throw new Error("Invalid content format for editMessage: content should be a string.");
		}

		return this.apiRequest(`https://discord.com/api/v10/channels/${channel_id}/messages/${message_id}`, "PATCH", contentPayload);
	}

	async replyMessage(message_id, channel_id, replyContent) {
		this.debug("replyMessage called with:", { message_id, channel_id, replyContent });

		const responsePayload = typeof replyContent === "string" ? { content: replyContent } : replyContent;
		if (typeof responsePayload.content !== "string") {
			throw new Error("Invalid content format for replyMessage.");
		}

		return this.apiRequest(`https://discord.com/api/v10/channels/${channel_id}/messages`, "POST", {
			...responsePayload,
			message_reference: { message_id: message_id },
		});
	}

	//#endregion
	//#region User

	async getUser(user_id) {
		this.debug("getUser called with:", user_id);
		if (!user_id) throw new Error("User ID is required.");
		return this.apiRequest(`https://discord.com/api/v10/users/${user_id}`, "GET");
	}

	async getDMChannel(user_id) {
		this.debug("getDMChannel called with:", user_id);
		if (!user_id) throw new Error("User ID is required.");
		const dm = await this.apiRequest(`https://discord.com/api/v10/users/@me/channels`, "POST", {
			recipient_id: user_id,
		});
		return this.extendChannel(dm);
	}

	async sendDM(user_id, content) {
		this.debug("sendDM called with:", { user_id, content });
		const dmChannel = await this.getDMChannel(user_id);
		return dmChannel.send(content);
	}

	async kickMember(guild_id, user_id, reason) {
		this.debug("kickMember called with:", { guild_id, user_id, reason });
		if (!guild_id || !user_id) throw new Error("Guild ID and User ID are required.");
		return this.apiRequest(
			`https://discord.com/api/v10/guilds/${guild_id}/members/${user_id}`,
			"DELETE",
			reason ? { reason } : undefined,
		);
	}

	async banMember(guild_id, user_id, reason) {
		this.debug("banMember called with:", { guild_id, user_id, reason });
		if (!guild_id || !user_id) throw new Error("Guild ID and User ID are required.");
		return this.apiRequest(
			`https://discord.com/api/v10/guilds/${guild_id}/bans/${user_id}`,
			"PUT",
			reason ? { reason } : undefined,
		);
	}

	async unbanMember(guild_id, user_id) {
		this.debug("unbanMember called with:", { guild_id, user_id });
		if (!guild_id || !user_id) throw new Error("Guild ID and User ID are required.");
		return this.apiRequest(`https://discord.com/api/v10/guilds/${guild_id}/bans/${user_id}`, "DELETE");
	}

	//#endregion
};
