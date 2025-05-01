const EventEmitter = require("events");
const { ApiManager, CommandManager, WebSocketManager } = require("./core");

const { checkPayload, get_Channel, get_Guild, get_User, get_Member, get_Message, get_DMChannel, Attachment } = require("./utils");

class Client extends EventEmitter {
	#token;
	constructor(token, options = { intents: 3276799 }) {
		super();
		this.#token = token;
		this.options = options;
		this.intents = options.intents;
		this.gatewayUrl = "wss://gateway.discord.gg/?v=10&encoding=json";
		this.cache = { _user: new Map(), _guild: new Map(), _channel: new Map(), _DMchannel: new Map(), _member: new Map() };
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

	getChannel = (id, cache = true) => get_Channel(id, cache, this);
	getDMChannel = (id, cache = true) => get_DMChannel(id, cache, this);
	getGuild = (id, cache = true) => get_Guild(id, cache, this);
	getUser = (id, cache = true) => get_User(id, cache, this);
	getMember = (guild_id, user_id, cache = true) => get_Member(guild_id, user_id, cache, this);
	getMessage = (id, c, cache = true) => get_Message(id, c, cache, this);

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

module.exports = { Client, Attachment };
