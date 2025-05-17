module.exports = function calcIntent(intentArray) {
	const INTENT_MAP = {
		GUILDS: 1 << 0,
		GUILD_MEMBERS: 1 << 1,
		GUILD_MODERATION: 1 << 2,
		GUILD_EXPRESSIONS: 1 << 3,
		GUILD_INTEGRATIONS: 1 << 4,
		GUILD_WEBHOOKS: 1 << 5,
		GUILD_INVITES: 1 << 6,
		GUILD_VOICE_STATES: 1 << 7,
		GUILD_PRESENCES: 1 << 8,
		GUILD_MESSAGES: 1 << 9,
		GUILD_MESSAGE_REACTIONS: 1 << 10,
		GUILD_MESSAGE_TYPING: 1 << 11,
		DIRECT_MESSAGES: 1 << 12,
		DIRECT_MESSAGE_REACTIONS: 1 << 13,
		DIRECT_MESSAGE_TYPING: 1 << 14,
		MESSAGE_CONTENT: 1 << 15,
		GUILD_SCHEDULED_EVENTS: 1 << 16,
		AUTO_MODERATION_CONFIGURATION: 1 << 20,
		AUTO_MODERATION_EXECUTION: 1 << 21,
		GUILD_MESSAGE_POLLS: 1 << 24,
		DIRECT_MESSAGE_POLLS: 1 << 25,
	};

	if (!Array.isArray(intentArray)) {
		if (typeof intentArray === "number") {
			return intentArray;
		}
		throw new TypeError("Intent array must be an array");
	}

	if (intentArray.length === 0) {
		return 0;
	}

	if (intentArray?.includes("all") || intentArray?.includes("ALL")) {
		return 131071;
	}

	const result = intentArray
		.map((name) => name.trim().toUpperCase())
		.filter((name) => INTENT_MAP.hasOwnProperty(name))
		.reduce((total, name) => total | BigInt(INTENT_MAP[name]), 0n);

	return result.toString();
};
