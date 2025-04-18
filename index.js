const EventEmitter = require("events");
const WebSocketManager = require("./core/WebSocketManager");
const ApiManager = require("./core/ApiManager");
const extendGuild = require("./structures/Guild");
const extendChannel = require("./structures/Channel");
const extendMessage = require("./structures/Message");
const extendUser = require("./structures/User");
const extendInteraction = require("./structures/Interaction");
const checkPayload = require("./utils/checkPayload");
const getChannel = require("./utils/getChannel");
const getGuild = require("./utils/getGuild");
const getUser = require("./utils/getUser");
const getMessage = require("./utils/getMessage");

class Client extends EventEmitter {
	constructor(token, options = { _init: true, intents: 3276799 }) {
		super();
		this.token = token;
		this.options = options;
		this.intents = options.intents;
		this.headers = { Authorization: `Bot ${this.token}`, "Content-Type": "application/json" };
		this.gatewayUrl = "wss://gateway.discord.gg/?v=10&encoding=json";
		this.cache = { _user: new Map(), _guild: new Map(), _channel: new Map(), _member: new Map() };
		this.sequenceNumber = null;
		this.user = null;
		this.guilds = null;
		this.isReady = false;

		this.api = new ApiManager(this);
		this.ws = new WebSocketManager(this);

		this.extendGuild = (g) => extendGuild(g, this);
		this.extendChannel = (c) => extendChannel(c, this);
		this.extendMessage = (m) => extendMessage(m, this);
		this.extendUser = (u) => extendUser(u, this);
		this.extendInteraction = (i) => extendInteraction(i, this);
		this.checkMessagePayload = checkPayload;

		this.getChannel = (id) => getChannel(id, this);
		this.getGuild = (id) => getGuild(id, this);
		this.getUser = (id) => getUser(id, this);
		this.getMessage = (id) => getMessage(id, this);

		if (options._init) this.ws.connect();
	}

	debug(message, ...args) {
		if (this.listeners("debug").length > 0) this.emit("debug", `[DEBUG] ${message}`, ...args);
	}

	destroy() {
		this.ws.destroy();
		this.user = null;
		this.guilds = null;
		this.sequenceNumber = null;
		this.cache._user.clear();
		this.cache._guild.clear();
		this.cache._channel.clear();
		this.cache._member.clear();
		this.removeAllListeners();
		this.debug("Client destroyed");
	}
}

module.exports = { Client };
