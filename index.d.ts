import { EventEmitter } from "events";

export interface RawUser {
	id: string;
	username: string;
	discriminator: string;
	avatar: string | null;
	bot?: boolean;
	[extraProps: string]: any;
}

export interface RawGuild {
	id: string;
	name: string;
	[extraProps: string]: any;
}

export interface RawChannel {
	id: string;
	name: string;
	type: number;
	[extraProps: string]: any;
}

export interface RawMessage {
	id: string;
	content: string;
	channel_id: string;
	guild_id?: string;
	author: RawUser;
	[extraProps: string]: any;
}

export interface MessagePayload {
	content?: string;
	embeds?: any[];
	files?: any[];
	[extraProps: string]: any;
}
export interface CommandManager {
	registerGlobal(commands: any[]): Promise<any>;
	registerGuild(guildId: string, commands: any[]): Promise<any>;
	safeRegisterGlobal(commands: any[]): Promise<any>;
	getGlobal(): Promise<any[]>;
	getGuild(guildId: string): Promise<any[]>;
	deleteGlobalCommand(commandId: string): Promise<any>;
	deleteGuildCommand(guildId: string, commandId: string): Promise<any>;
	clearGlobalCommands(): Promise<any>;
	clearGuildCommands(guildId: string): Promise<any>;
}

export interface WebSocketManager {
	connect(retries?: number): void;
	identify(): void;
	heartbeat(interval: number): void;
	handleMessage(data: any): void;
	destroy(): void;
}

export interface ExtendedUser extends RawUser {
	getAvatarURL: (size?: number) => string | null;
	send: (content: string | MessagePayload) => Promise<ExtendedMessage>;
}

export interface ExtendedGuild extends RawGuild {
	getGuildChannels: () => Promise<any>;
	getGuildMembers: (limit?: number) => Promise<any>;
	leave: () => Promise<any>;
}

export interface ExtendedChannel extends RawChannel {
	send: (content: string | MessagePayload) => Promise<ExtendedMessage>;
}

export interface ExtendedMessage extends RawMessage {
	channel: () => Promise<ExtendedChannel>;
	guild: () => Promise<ExtendedGuild>;
	user: () => Promise<ExtendedUser>;
	reply: (content: string | MessagePayload) => Promise<ExtendedMessage>;
	edit: (newContent: string | MessagePayload) => Promise<ExtendedMessage>;
}

export interface ExtendedInteraction {
	client: Client;
	user: () => Promise<ExtendedUser>;
	channel: () => Promise<ExtendedChannel>;
	guild: () => Promise<ExtendedGuild>;
	reply: (content: string | MessagePayload) => Promise<ExtendedMessage>;
	[extraProps: string]: any;
}

export interface ClientOptions {
	intents?: number;
	identifyProperties?: {
		os?: string;
		browser?: string;
		device?: string;
	};
	_init?: boolean;
}

export class Client extends EventEmitter {
	constructor(token: string, options?: ClientOptions);

	cache: {
		_user: Map<string, RawUser>;
		_guild: Map<string, RawGuild>;
		_channel: Map<string, RawChannel>;
		_member: Map<string, any>;
	};

	intents: number;
	isReady: boolean;

	ws: WebSocketManager;
	api: {
		get: (url: string) => Promise<any>;
		post: (url: string, body: any) => Promise<any>;
		put: (url: string, body: any) => Promise<any>;
		patch: (url: string, body: any) => Promise<any>;
		delete: (url: string, body?: any) => Promise<any>;
	};
	commandManager: CommandManager;

	// Extend methods
	extendUser: (user: RawUser) => ExtendedUser;
	extendGuild: (guild: RawGuild) => ExtendedGuild;
	extendChannel: (channel: RawChannel) => ExtendedChannel;
	extendMessage: (message: RawMessage) => ExtendedMessage;
	extendInteraction: (interaction: any) => ExtendedInteraction;

	// Fetch methods
	getUser: (userId: string) => Promise<ExtendedUser>;
	getChannel: (channelId: string) => Promise<ExtendedChannel>;
	getGuild: (guildId: string) => Promise<ExtendedGuild>;
	getMessage: (channelId: string, messageId: string) => Promise<ExtendedMessage>;

	// Other
	checkMessagePayload: (payload: MessagePayload) => void;
	debug: (message: string, ...args: any[]) => void;
	destroy: () => void;
}
