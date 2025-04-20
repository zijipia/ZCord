const WebSocket = require("ws");

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
		this.ws = new WebSocket(this.client.gatewayUrl);

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
				},
			}),
		);
	}

	heartbeat(interval) {
		this.client.debug("Starting heartbeat with interval:", interval);
		this.heartbeatInterval = setInterval(() => {
			this.client.debug("Sending heartbeat...");
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
				this.client.isReady = true;
				this.client.user = payload.user;
				this.client.debug(`Logged in as ${this.client.user.username}`);
				this.client.emit("ready", payload);
				break;
			case "MESSAGE_CREATE":
				this.client.emit("messageCreate", this.client.extendMessage(payload));
				break;
			case "INTERACTION_CREATE":
				this.client.emit("interactionCreate", this.client.extendInteraction(payload));
				break;
			case "VOICE_STATE_UPDATE":
				this.client.emit("voiceStateUpdate", payload);
				break;
			case "VOICE_SERVER_UPDATE":
				this.client.emit("voiceServerUpdate", payload);
				break;
			case "PRESENCE_UPDATE":
				if (payload.user?.id) {
					this.client.cache._user.set(payload.user.id, {
						...this.client.cache._user.get(payload.user.id),
						...payload.user,
						presence: payload,
					});
				}
				this.client.emit("presenceUpdate", payload);
				break;
			case "GUILD_CREATE": {
				const guild = this.client.extendGuild(payload);
				this.client.cache._guild.set(payload.id, guild);

				// Cache channels
				if (Array.isArray(payload.channels)) {
					for (const channel of payload.channels) {
						const extended = this.client.extendChannel(channel);
						this.client.cache._channel.set(channel.id, extended);
					}
				}

				// Cache members
				if (Array.isArray(payload.members)) {
					for (const member of payload.members) {
						this.client.cache._member.set(`${payload.id}:${member.user.id}`, this.client.extendUser(member));
						this.client.cache._user.set(member.user.id, this.client.extendUser(member.user));
					}
				}

				// Cache presence
				if (Array.isArray(payload.presences)) {
					for (const presence of payload.presences) {
						if (presence.user?.id) {
							const cached = this.client.cache._user.get(presence.user.id) || {};
							this.client.cache._user.set(presence.user.id, {
								...cached,
								...presence.user,
								presence,
							});
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
