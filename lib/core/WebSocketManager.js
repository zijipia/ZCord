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
		}

		switch (event) {
			case "READY":
				console.log("READY event received");
				this.client.isReady = true;
				this.client.Me = new Me(payload.user, this.client);
				this.client.user = payload.user;
				this.client.debug(`Logged in as ${this.client.user.username}`);
				this.client.emit("ready", payload);
				break;
			case "MESSAGE_CREATE":
				this.client.emit("messageCreate", new Message(payload, this.client));
				break;
			case "INTERACTION_CREATE":
				this.client.emit("interactionCreate", new Message(payload, this.client));
				break;
			case "VOICE_STATE_UPDATE":
				this.client.emit("voiceStateUpdate", payload);
				break;
			case "VOICE_SERVER_UPDATE":
				this.client.emit("voiceServerUpdate", payload);
				break;
			case "GUILD_MEMBER_ADD":
				const member = new Member(payload, this.client);
				this.client.cache._user.set(payload.user.id, new User(payload.user, this.client));
				this.client.cache._member.set(`${payload.guild_id}:${payload.user.id}`, member);
				this.client.emit("guildMemberAdd", member);
				break;
			case "GUILD_MEMBER_REMOVE":
				this.client.cache._user.delete(payload.user.id);
				this.client.cache._member.delete(`${payload.guild_id}:${payload.user.id}`);
				this.client.emit("guildMemberRemove", new Member(payload, this.client));
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
				this.client.emit("presenceUpdate", payload);
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

				this.client.emit("guildCreate", guild);
				break;
			}
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
