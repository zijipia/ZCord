# 🧩 Zcord

**Zcord** is a simple client library for Discord that helps you create bots quickly with lower-level control compared to
`discord.js`.

---

## 🚀 Features

- Directly connects to the Discord Gateway via WebSocket
- Sends/receives events such as `messageCreate`, `interactionCreate`, `guildCreate`, ...
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
	console.log(`Logged in as ${client.user.username}`);
});

client.on("messageCreate", async (message) => {
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
| `intents`            | Defaults to `3276799` (all intents)                   |
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

| Events            | Parms         |
| ----------------- | ------------- |
| ready             | payload       |
| messageCreate     | Message       |
| interactionCreate | not implement |
| voiceStateUpdate  | payload       |
| voiceServerUpdate | payload       |
| guildMemberAdd    | Member        |
| guildMemberRemove | Member        |
| PRESENCE_UPDATE   | payload       |
| guildCreate       | Guild         |
| --- debug         | ----          |
| debug             | ...arg        |
| raw               | ...arg        |

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
