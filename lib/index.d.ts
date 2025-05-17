import { EventEmitter } from "events";

// --------------------------------------------------------------- //
// #region Raw
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

export interface RawUser {
	id: string;
	username: string;
	discriminator: string;
	avatar: string | null;
	[extraProps: string]: any;
}

//#endregion Raw
// --------------------------------------------------------------- //
// #region Guild
export class Guild {
	constructor(data: any, client: Client);

	client: Client;
	id?: string;
	name?: string;
	icon?: string;
	icon_hash?: string;
	splash?: string;
	discovery_splash?: string;
	owner?: boolean;
	owner_id?: string;
	permissions?: string;
	region?: string;
	afk_channel_id?: string;
	afk_timeout?: number;
	widget_enabled?: boolean;
	widget_channel_id?: string;
	verification_level?: number;
	default_message_notifications?: number;
	explicit_content_filter?: number;
	role: any[];
	emojis: any[];
	features: string[];
	mfa_level?: number;
	application_id?: string;
	system_channel_id?: string;
	system_channel_flags?: number;
	rules_channel_id?: string;
	max_presences?: number | null;
	max_members?: number | null;
	vanity_url_code?: string;
	description?: string | null;
	banner?: string | null;
	premium_tier?: number;
	premium_subscription_count?: number | null;
	preferred_locale?: string;
	public_updates_channel_id?: string;
	max_video_channel_users?: number | null;
	max_stage_video_channel_users?: number | null;
	approximate_member_count?: number | null;
	approximate_presence_count?: number | null;
	welcome_screen?: any;
	nsfw_level?: number | null;
	stickers: any[];
	premium_progress_bar_enabled?: boolean | null;
	safety_alerts_channel_id?: string | null;
	incidents_data?: any;

	get BannerURL(): string | null;
	get IconURL(): string | null;
	get SplashURL(): string | null;

	setNickname(nickname: string): Promise<any>;
}
// #endregion Guild
// --------------------------------------------------------------- //
// #region Channel
export class Channel {
	constructor(data: any, client: Client);

	client: Client;
	id: string;
	type: number;
	guild_id: string | null;
	guild: Guild;
	position: number | null;
	permission_overwrites: any;
	name: string | null;
	topic: string | null;
	nsfw: boolean;
	last_message_id: string | null;
	bitrate: number | null;
	user_limit: number | null;
	rate_limit_per_user: number | null;
	recipients: any[];
	icon: string | null;
	owner_id: string | null;
	application_id: string | null;
	managed: boolean;
	parent_id: string | null;
	last_pin_timestamp: Date | null;
	rtc_region: string | null;
	video_quality_mode: number | null;
	message_count: number | null;
	member_count: number | null;
	thread_metadata: any;
	member: any;
	default_auto_archive_duration: number | null;
	permission: any;
	flags: number | null;
	total_message_sent: number | null;
	available_tags: any;
	applied_tags: any;
	default_reaction_emoji: any;
	default_thread_rate_limit_per_user: number | null;
	default_sort_order: number | null;
	default_forum_layout: number | null;

	send(content: string | MessagePayload): Promise<Message>;
	fetchMessages(limit?: number): Promise<any>;
	delete(): Promise<any>;
}
// #endregion Channel
// --------------------------------------------------------------- //
// #region Message

export interface MessagePayload {
	content?: string;
	tts?: boolean;
	embeds?: any[];
	components?: any[];
	sticker_ids?: string[];
	files?: any[];
	allowed_mentions?: any;
	message_reference?: any;
	flags?: number;
}

export interface MessageReference {
	message_id: string;
	channel_id: string;
	guild_id: string;
	fail_if_not_exists: boolean;
}

export class Message {
	constructor(data: any, client: Client);

	client: Client;
	id: string;
	guild_id: string;
	guild: Guild;
	channel_id: string;
	channel: Channel;
	author: any;
	user: User;
	content: string;
	timestamp: Date;
	edited_timestamp: Date | null;
	tts: boolean;
	mention_everyone: boolean;
	mentions: any[];
	mention_roles: any[];
	mention_channels: any[];
	attachments: any[];
	embeds: any[];
	reactions: any[];
	nonce: string | number | null;
	pinned: boolean;
	webhook_id: string | null;
	type: number;
	activity: any;
	application: any;
	application_id: string | null;
	flags: number;
	message_reference: MessageReference | null;
	message_snapshots: any[];
	referenced_message: any;
	interaction_metadata: any;
	interaction: any;
	thread: any;
	components: any[];
	sticker_items: any[];
	sticker: any;
	position: number | null;
	role_subscription_data: any;
	resolved: any;
	poll: any;
	call: any;

	reply(replyContent: string | MessagePayload): Promise<Message>;
	edit(newContent: string | MessagePayload): Promise<Message>;
}
// #endregion Message
// --------------------------------------------------------------- //
// #region User
export interface AvatarOptions {
	size?: number;
	gif?: boolean;
}

export class User {
	constructor(data: any, client: Client);

	id: string;
	username: string;
	discriminator: string;
	global_name: string;
	avatar: string;
	bot: boolean;
	system: boolean;
	mfa_enabled: boolean;
	banner: string | null;
	accent_color: number | null;
	locale: string | null;
	verified: boolean;
	email: string | null;
	flags: number | null;
	premium_type: number | null;
	public_flags: number | null;
	avatar_decoration_data: any;

	getAvatarURL(opt?: AvatarOptions): string | null;
	send(content: string | MessagePayload): Promise<Message>;
}

export class Member extends User {
	constructor(data: any, client: Client);
	guild_id: string;
	guild: Guild;
	nick: string | null;
	premium_since: Date | null;
	deaf: boolean;
	mute: boolean;
	joined_at: Date;
	pending: boolean | null;
	permissions: string | null;
	communication_disabled_until: Date | null;
	roles: string[];

	edit({ nick, reason, roles, mute, deaf, channel_id, communication_disabled_until, flags }): Promise<Member>;
}

export class Me extends User {
	constructor(data: any, client: Client);
	voiceState({ channel_id, guild_id, self_mute, self_deaf }): Promise<Me>;
	edit({ username, avatar, banner, accent_color }): Promise<Me>;
	presence({ activities, status, since, afk }): Promise<Me>;
}

// #endregion User
// --------------------------------------------------------------- //
// #region Manager
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

export interface ApiManager {
	get: (url: string) => Promise<any>;
	post: (url: string, body: any) => Promise<any>;
	put: (url: string, body: any) => Promise<any>;
	patch: (url: string, body: any) => Promise<any>;
	delete: (url: string, body?: any) => Promise<any>;
}

// #endregion Manager
// --------------------------------------------------------------- //
// #region Client
export interface ClientOptions {
	intents?: number;
	identifyProperties?: {
		os?: string;
		browser?: string;
		device?: string;
	};
	_init?: boolean;
	presence?: {
		activities: [
			{
				name: string;
				type: number;
			},
		];
		status: "online" | "dnd" | "idle" | "invisible";
		since: number;
		afk: false;
	};
}

export class Client extends EventEmitter {
	constructor(token: string, options?: ClientOptions);

	cache: {
		_user: Map<string, RawUser>;
		_guild: Map<string, RawGuild>;
		_channel: Map<string, RawChannel>;
		_member: Map<string, any>;
	};
	/**
	 * List of Intents
	 * @link https://discord.com/developers/docs/topics/gateway#list-of-intents
	 */
	intents: [Intent];
	isReady: boolean;
	Me: Me;

	ws: WebSocketManager;
	api: ApiManager;
	commandManager: CommandManager;

	// Fetch methods
	getUser: (userId: string) => Promise<User>;
	getMember: (guildId: string, userId: string) => Promise<Member>;
	getChannel: (channelId: string) => Promise<Channel>;
	getGuild: (guildId: string) => Promise<Guild>;
	getMessage: (channelId: string, messageId: string) => Promise<Message>;

	// Other
	checkMessagePayload: (payload: MessagePayload) => void;
	debug: (message: string, ...args: any[]) => void;
	destroy: () => void;

	// Events
	on: (event: ClientEvents, listener: (...args: any[]) => void) => this;
	once: (event: ClientEvents, listener: (...args: any[]) => void) => this;
	emit: (event: ClientEvents | string, ...args: any[]) => boolean;
	removeListener: (event: ClientEvents, listener: (...args: any[]) => void) => this;
	addListener: (event: ClientEvents, listener: (...args: any[]) => void) => this;
	off: (event: ClientEvents, listener: (...args: any[]) => void) => this;
}
// #endregion Client

export interface AttachmentData {
	name?: string;
	description?: string;
}

export class Attachment {
	constructor(file: string | Buffer, data?: AttachmentData);
	file: string | Buffer;
	name: string;
	description: string;
}

export type ClientEvents =
	| "READY"
	| "INTERACTION_CREATE"
	| "RESUMED"
	| "VOICE_SERVER_UPDATE"
	| "GUILD_CREATE"
	| "GUILD_UPDATE"
	| "GUILD_DELETE"
	| "GUILD_ROLE_CREATE"
	| "GUILD_ROLE_UPDATE"
	| "GUILD_ROLE_DELETE"
	| "THREAD_CREATE"
	| "THREAD_UPDATE"
	| "THREAD_DELETE"
	| "THREAD_LIST_SYNC"
	| "THREAD_MEMBER_UPDATE"
	| "THREAD_MEMBERS_UPDATE"
	| "STAGE_INSTANCE_CREATE"
	| "STAGE_INSTANCE_UPDATE"
	| "STAGE_INSTANCE_DELETE"
	| "CHANNEL_CREATE"
	| "CHANNEL_UPDATE"
	| "CHANNEL_DELETE"
	| "CHANNEL_PINS_UPDATE"
	| "GUILD_MEMBER_ADD"
	| "GUILD_MEMBER_UPDATE"
	| "GUILD_MEMBER_REMOVE"
	| "GUILD_BAN_ADD"
	| "GUILD_BAN_REMOVE"
	| "GUILD_EMOJIS_UPDATE"
	| "GUILD_STICKERS_UPDATE"
	| "GUILD_INTEGRATIONS_UPDATE"
	| "GUILD_WEBHOOKS_UPDATE"
	| "INVITE_CREATE"
	| "INVITE_DELETE"
	| "VOICE_STATE_UPDATE"
	| "PRESENCE_UPDATE"
	| "MESSAGE_CREATE"
	| "MESSAGE_UPDATE"
	| "MESSAGE_DELETE"
	| "MESSAGE_DELETE_BULK"
	| "MESSAGE_REACTION_ADD"
	| "MESSAGE_REACTION_REMOVE"
	| "MESSAGE_REACTION_REMOVE_ALL"
	| "MESSAGE_REACTION_REMOVE_EMOJI"
	| "TYPING_START"
	| "GUILD_SCHEDULED_EVENT_CREATE"
	| "GUILD_SCHEDULED_EVENT_UPDATE"
	| "GUILD_SCHEDULED_EVENT_DELETE"
	| "GUILD_SCHEDULED_EVENT_USER_ADD"
	| "GUILD_SCHEDULED_EVENT_USER_REMOVE"
	| "debug"
	| "raw";

export type Intent =
	| "ALL"
	| "GUILDS"
	| "GUILD_MEMBERS"
	| "GUILD_MODERATION"
	| "GUILD_EXPRESSIONS"
	| "GUILD_INTEGRATIONS"
	| "GUILD_WEBHOOKS"
	| "GUILD_INVITES"
	| "GUILD_VOICE_STATES"
	| "GUILD_PRESENCES"
	| "GUILD_MESSAGES"
	| "GUILD_MESSAGE_REACTIONS"
	| "GUILD_MESSAGE_TYPING"
	| "DIRECT_MESSAGES"
	| "DIRECT_MESSAGE_REACTIONS"
	| "DIRECT_MESSAGE_TYPING"
	| "MESSAGE_CONTENT"
	| "GUILD_SCHEDULED_EVENTS"
	| "AUTO_MODERATION_CONFIGURATION"
	| "AUTO_MODERATION_EXECUTION"
	| "GUILD_MESSAGE_POLLS"
	| "DIRECT_MESSAGE_POLLS";
