# 🧩 Zcord

**Zcord** is a simple client library for Discord that helps you create bots quickly with lower-level control compared to
`discord.js`.

---

## 🚀 Features

- Directly connects to the Discord Gateway via WebSocket
- Sends/receives events such as `MESSAGE_CREATE`, `INTERACTION_CREATE`, `GUILD_CREATE`, ...
- Uses Discord's REST API to:
  - Send messages
  - Create global or guild-specific slash commands
  - Fetch user, server, and channel information

---

## 📦 Installation

```bash
npm install zcord
```

---

## 🧪 Basic Usage Example

```js
const { Client } = require("zcord");

const client = new Client("YOUR_BOT_TOKEN");

client.on("ready", () => {
	console.log(`Logged in as ${client.Me.username}`);
});

client.on("MESSAGE_CREATE", async (message) => {
	if (message.content === "!test") {
		const msg = await message.reply("Pong! 🏓"); //reply messenger
		const user = await message.user;
		const avatar = user.getAvatarURL();

		user.send(message.guild.IconURL); //send DM
		await message.channel.send(avatar); //send channel

		msg.edit(`${user.username} Avatar:`); //edit messenger
	}
});
```

[See more example!!!](https://github.com/zijipia/ZCord/tree/main/example)

## 📘 API Documentation

### Create a client

```js
new Client(token: string, options?: ClientOptions)
```

| Option               | Description                                           |
| -------------------- | ----------------------------------------------------- |
| `intents`            | Defaults to `ALL` (all intents)                       |
| `_init`              | Automatically connects to gateway if `true` (default) |
| `identifyProperties` | Customize `os`, `browser`, and `device` info          |

---

### Utility Methods

| Method                                                | Description                      |
| ----------------------------------------------------- | -------------------------------- |
| `client.getUser(id)`                                  | Fetch user info                  |
| `client.getMember(guild_id, user_id)`                 | Fetch guild member info          |
| `client.getChannel(id)`                               | Fetch channel info               |
| `client.getGuild(id)`                                 | Fetch server info                |
| `client.getMessage(channelId, messageId)`             | Fetch message                    |
| `client.commandManager.registerGlobal([...])`         | Register global slash commands   |
| `client.commandManager.registerGuild(guildId, [...])` | Register guild-specific commands |

---

## 📩 Events

| Events                            | Parms   |
| --------------------------------- | ------- |
| READY                             | payload |
| INTERACTION_CREATE                | Message |
| RESUMED                           | payload |
| VOICE_SERVER_UPDATE               | payload |
| GUILD_CREATE                      | Guild   |
| GUILD_UPDATE                      | Guild   |
| GUILD_DELETE                      | Guild   |
| GUILD_ROLE_CREATE                 | Guild   |
| GUILD_ROLE_UPDATE                 | Guild   |
| GUILD_ROLE_DELETE                 | Guild   |
| THREAD_CREATE                     | payload |
| THREAD_UPDATE                     | payload |
| THREAD_DELETE                     | payload |
| THREAD_LIST_SYNC                  | payload |
| THREAD_MEMBER_UPDATE              | payload |
| THREAD_MEMBERS_UPDATE             | payload |
| STAGE_INSTANCE_CREATE             | payload |
| STAGE_INSTANCE_UPDATE             | payload |
| STAGE_INSTANCE_DELETE             | payload |
| CHANNEL_CREATE                    | payload |
| CHANNEL_UPDATE                    | payload |
| CHANNEL_DELETE                    | payload |
| CHANNEL_PINS_UPDATE               | payload |
| GUILD_MEMBER_ADD                  | Member  |
| GUILD_MEMBER_UPDATE               | Member  |
| GUILD_MEMBER_REMOVE               | Member  |
| GUILD_BAN_ADD                     | payload |
| GUILD_BAN_REMOVE                  | payload |
| GUILD_EMOJIS_UPDATE               | payload |
| GUILD_STICKERS_UPDATE             | payload |
| GUILD_INTEGRATIONS_UPDATE         | payload |
| GUILD_WEBHOOKS_UPDATE             | payload |
| INVITE_CREATE                     | payload |
| INVITE_DELETE                     | payload |
| VOICE_STATE_UPDATE                | payload |
| PRESENCE_UPDATE                   | payload |
| MESSAGE_CREATE                    | Message |
| MESSAGE_UPDATE                    | Message |
| MESSAGE_DELETE                    | Message |
| MESSAGE_DELETE_BULK               | Message |
| MESSAGE_REACTION_ADD              | Message |
| MESSAGE_REACTION_REMOVE           | Message |
| MESSAGE_REACTION_REMOVE_ALL       | Message |
| MESSAGE_REACTION_REMOVE_EMOJI     | Message |
| TYPING_START                      | payload |
| GUILD_SCHEDULED_EVENT_CREATE      | payload |
| GUILD_SCHEDULED_EVENT_UPDATE      | payload |
| GUILD_SCHEDULED_EVENT_DELETE      | payload |
| GUILD_SCHEDULED_EVENT_USER_ADD    | payload |
| GUILD_SCHEDULED_EVENT_USER_REMOVE | payload |
| --- debug                         | ----    |
| debug                             | ...arg  |
| raw                               | ...arg  |

---

## 📦 Supported Types

Zcord defines the following types:

- `RawUser`, `RawGuild`, `RawChannel`, `RawMessage`
- `Guild`, `Channel`, `User`, `Member`, `Message`,
- `CommandManager`, `WebSocketManager`
- `ClientOptions`, `MessagePayload`

---

## 📄 License

MIT © 2025 — Ziji
