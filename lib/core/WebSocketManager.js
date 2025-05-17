const WebSocket = require("ws");
const { Message, Channel, User, Member, Guild, Me } = require("../structures");

class WebSocketManager {
	#token;
	constructor(client, token) {
		this.client = client;
		this.ws = null;
		this.heartbeatInterval = null;
		this.#token = token;
	}

	connect(retries = 1) {
		this.client.debug("Connecting to Discord Gateway...");
		this.ws = new WebSocket(this.client?.options?.gatewayUrl || "wss://gateway.discord.gg/?v=10&encoding=json");

		this.ws.on("open", () => {
			this.client.debug("WebSocket connection opened");
			this.identify();
		});

		this.ws.on("message", (data) => this.handleMessage(data));

		this.ws.on("close", (code, reason) => {
			this.client.debug("WebSocket closed with code:", code, "reason:", reason);
			clearInterval(this.heartbeatInterval);
			setTimeout(() => this.connect(retries + 1), Math.min(1000 * 2 ** retries, 60000));
		});

		this.ws.on("error", (error) => {
			this.client.debug("WebSocket error:", error);
		});
	}

	send(data) {
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			this.client.debug("Sending data:", data);
			this.ws.send(JSON.stringify(data));
		} else {
			this.client.debug("WebSocket is not open. Cannot send data:", data);
		}
	}

	identify() {
		this.client.debug("Identifying bot...");
		this.ws.send(
			JSON.stringify({
				op: 2,
				d: {
					token: this.#token,
					intents: this.client.intents,
					properties: {
						os: this.client.options.identifyProperties?.os || "linux",
						browser: this.client.options.identifyProperties?.browser || "node",
						device: this.client.options.identifyProperties?.device || "node",
					},
					presence: this.client.options?.presence,
				},
			}),
		);
	}

	heartbeat(interval) {
		this.client.debug("Starting heartbeat with interval:", interval);
		this.heartbeatInterval = setInterval(() => {
			this.client.debug("Sending heartbeat:" + this.client?.sequenceNumber);
			this.ws.send(JSON.stringify({ op: 1, d: this.client.sequenceNumber }));
		}, interval);
	}

	handleMessage(data) {
		const { t: event, s: seq, op, d: payload } = JSON.parse(data);
		if (seq) this.client.sequenceNumber = seq;

		if (this.client.listeners("raw").length > 0) this.client.emit("raw", `[RAW] Received operation: ${op}: ${event}`, payload);

		switch (op) {
			case 10:
				this.heartbeat(payload.heartbeat_interval);
				break;
			case 11:
				this.client.debug("Heartbeat acknowledged");
				break;
			case 9:
				this.client.debug("Session invalidated.");
				console.log("Session invalidated. Check your token or intents.");
				this.ws.close(4000, "Session invalidated");
				this.client.destroy();
				return;
		}

		switch (event) {
			case "READY":
				this.client.isReady = true;
				this.client.Me = new Me(payload.user, this.client);
				this.client.user = payload.user;
				this.client.debug(`Logged in as ${this.client.user.username}`);
				this.client.emit("READY", payload);
				break;
			case "INTERACTION_CREATE":
				this.client.emit(event, new Message(payload, this.client));
				break;
			case "RESUMED":
				this.client.debug("Session resumed");
				break;
			case "VOICE_SERVER_UPDATE":
				this.client.emit(event, payload);
				break;
			case "GUILD_CREATE": {
				const guild = new Guild(payload, this.client);
				this.client.cache._guild.set(payload.id, guild);

				// Cache channels
				if (Array.isArray(payload.channels)) {
					for (const channel of payload.channels) {
						this.client.cache._channel.set(channel.id, new Channel(channel, this.client));
					}
				}

				// Cache members
				if (Array.isArray(payload.members)) {
					for (const member of payload.members) {
						this.client.cache._member.set(`${payload.id}:${member.user.id}`, new Member(member, this.client));
						this.client.cache._user.set(member.user.id, new User(member.user, this.client));
					}
				}

				// Cache presence
				if (Array.isArray(payload.presences)) {
					for (const presence of payload.presences) {
						if (presence.user?.id) {
							const cached = this.client.cache._user.get(presence.user.id) || {};
							this.client.cache._user.set(
								presence.user.id,
								new User(
									{
										...cached,
										...presence.user,
										presence,
									},
									this.client,
								),
							);
						}
					}
				}

				this.client.emit(event, guild);
				break;
			}
			case "GUILD_UPDATE":
				const oldGuild = this.client.cache._guild.get(payload.id);
				const updatedGuild = new Guild(payload, this.client);
				this.client.cache._guild.set(payload.id, updatedGuild);
				this.client.emit(event, oldGuild, updatedGuild);
				break;
			case "GUILD_DELETE":
				const deletedGuild = this.client.cache._guild.get(payload.id);
				this.client.cache._guild.delete(payload.id);

				for (const [key] of this.client.cache._channel) {
					if (key.startsWith(payload.id)) this.client.cache._channel.delete(key);
				}
				for (const [key] of this.client.cache._member) {
					if (key.startsWith(payload.id)) this.client.cache._member.delete(key);
				}

				this.client.emit(event, deletedGuild);
				break;

			case "GUILD_ROLE_CREATE":
			case "GUILD_ROLE_UPDATE":
			case "GUILD_ROLE_DELETE":
				const guild = this.client.cache._guild.get(payload.guild_id);
				if (guild) {
					const role = payload.role || payload.data;
					if (event === "GUILD_ROLE_CREATE") {
						guild.roles.set(role.id, role);
					} else if (event === "GUILD_ROLE_UPDATE") {
						guild.roles.set(role.id, role);
					}
					this.client.emit(event, guild, role);
				}
				break;
			case "THREAD_CREATE":
			case "THREAD_UPDATE":
			case "THREAD_DELETE":
				this.client.emit(event, payload);
				break;
			case "THREAD_LIST_SYNC":
			case "THREAD_MEMBER_UPDATE":
			case "THREAD_MEMBERS_UPDATE":
				this.client.emit(event, payload);
				break;

			case "STAGE_INSTANCE_CREATE":
			case "STAGE_INSTANCE_UPDATE":
			case "STAGE_INSTANCE_DELETE":
				this.client.emit(event, payload);
				break;
			case "CHANNEL_CREATE":
			case "CHANNEL_UPDATE":
			case "CHANNEL_DELETE":
				this.client.cache._channel.set(payload.id, new Channel(payload, this.client));
				this.client.emit(event, new Channel(payload, this.client));
				break;
			case "CHANNEL_PINS_UPDATE":
			case "GUILD_MEMBER_ADD":
				const member = new Member(payload, this.client);
				this.client.cache._user.set(payload.user.id, new User(payload.user, this.client));
				this.client.cache._member.set(`${payload.guild_id}:${payload.user.id}`, member);
				this.client.emit(event, member);
				break;
			case "GUILD_MEMBER_UPDATE":
			case "GUILD_MEMBER_REMOVE":
				this.client.cache._user.delete(payload.user.id);
				this.client.cache._member.delete(`${payload.guild_id}:${payload.user.id}`);
				this.client.emit(event, new Member(payload, this.client));
				break;
			case "GUILD_BAN_ADD":
			case "GUILD_BAN_REMOVE":
				this.client.cache._user.set(payload.user.id, new User(payload.user, this.client));
				this.client.emit(event, new User(payload.user, this.client));
				break;
			case "GUILD_EMOJIS_UPDATE":
			case "GUILD_STICKERS_UPDATE":
				this.client.emit(event, payload);
				break;
			case "GUILD_INTEGRATIONS_UPDATE":
			case "GUILD_WEBHOOKS_UPDATE":
				this.client.emit(event, payload);
				break;
			case "INVITE_CREATE":
			case "INVITE_DELETE":
				this.client.emit(event, payload);
				break;
			case "VOICE_STATE_UPDATE":
				this.client.emit("VOICE_STATE_UPDATE", payload);
				break;
			case "PRESENCE_UPDATE":
				if (payload.user?.id) {
					this.client.cache._user.set(
						payload.user.id,
						new User(
							{
								...this.client.cache._user.get(payload.user.id),
								...payload.user,
								presence: payload,
							},
							this.client,
						),
					);
				}
				this.client.emit("PRESENCE_UPDATE", payload);
				break;
			case "MESSAGE_CREATE":
				this.client.emit(event, new Message(payload, this.client));
				break;
			case "MESSAGE_UPDATE":
				this.client.emit(event, new Message(payload, this.client));
				break;
			case "MESSAGE_DELETE":
				this.client.emit(event, payload);
				break;
			case "MESSAGE_DELETE_BULK":
				this.client.emit("MESSAGE_DELETE_BULK", payload);
				break;
			case "MESSAGE_REACTION_ADD":
			case "MESSAGE_REACTION_REMOVE":
			case "MESSAGE_REACTION_REMOVE_ALL":
			case "MESSAGE_REACTION_REMOVE_EMOJI":
				this.client.emit(event, payload);
				break;
			case "TYPING_START":
				this.client.emit("TYPING_START", payload);
				break;

			case "GUILD_SCHEDULED_EVENT_CREATE":
			case "GUILD_SCHEDULED_EVENT_UPDATE":
			case "GUILD_SCHEDULED_EVENT_DELETE":
			case "GUILD_SCHEDULED_EVENT_USER_ADD":
			case "GUILD_SCHEDULED_EVENT_USER_REMOVE":
				this.client.emit(event, payload);
				break;
		}
	}

	destroy() {
		if (this.ws) {
			this.client.debug("Destroying WebSocket connection...");
			this.ws.removeAllListeners();
			this.ws.close(1000, "Client destroyed");
			this.ws = null;
		}
		clearInterval(this.heartbeatInterval);
	}
}

module.exports = WebSocketManager;
