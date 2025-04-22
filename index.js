const EventEmitter = require("events");
const ApiManager = require("./core/ApiManager");
const CommandManager = require("./core/CommandManager");
const WebSocketManager = require("./core/WebSocketManager");

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
	#token;
	constructor(token, options = { intents: 3276799 }) {
		super();
		this.#token = token;
		this.options = options;
		this.intents = options.intents;
		this.gatewayUrl = "wss://gateway.discord.gg/?v=10&encoding=json";
		this.cache = { _user: new Map(), _guild: new Map(), _channel: new Map(), _member: new Map() };
		this.sequenceNumber = null;
		this.isReady = false;

		this.api = new ApiManager(this, this.#token);
		this.commandManager = new CommandManager(this);
		this.ws = new WebSocketManager(this, this.#token);

		this.checkMessagePayload = checkPayload;

		if (options._init ?? true) this.ws.connect();
	}

	debug(message, ...args) {
		if (this.listeners("debug").length > 0) this.emit("debug", `[DEBUG] ${message}`, ...args);
	}

	extendGuild = (g) => extendGuild(g, this);
	extendChannel = (c) => extendChannel(c, this);
	extendMessage = (m) => extendMessage(m, this);
	extendUser = (u) => extendUser(u, this);
	extendInteraction = (i) => extendInteraction(i, this);

	getChannel = (id) => getChannel(id, this);
	getGuild = (id) => getGuild(id, this);
	getUser = (id) => getUser(id, this);
	getMessage = (id) => getMessage(id, this);

	destroy() {
		this.ws.destroy();
		this.user = null;
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
module.exports = Client;
