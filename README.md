# zdis

**zdis** is a lightweight Discord API client using direct WebSocket and REST connections to interact with the Discord Gateway,
without relying on third-party libraries like `discord.js`. It supports message sending, guild/channel/user interaction, and
responding to interactions.

## ✨ Installation

```bash
npm install zdis
```

## 🔧 Initialization

```js
const Client = require("zdis");

const client = new Client("YOUR_BOT_TOKEN");

client.on("ready", () => {
	console.log(`Bot logged in as ${client.user.username}`);
});
```

## 🧠 Supported Events

- `ready`
- `messageCreate`
- `interactionCreate`
- `voiceStateUpdate`
- `voiceServerUpdate`
- `debug`

```js
client.on("messageCreate", async (message) => {
	console.log(`[MSG] ${message.author.username}: ${message.content}`);

	if (message.content === "!ping") {
		await message.reply("Pong!");
	}
});
```

---

## 💬 Send Messages

```js
await client.sendMessage(channel_id, "Hello world!");
```

Or through the message object:

```js
message.reply("Reply content");
message.edit("Edit content");
```

---

## 📩 Send DM

```js
await client.sendDM(user_id, "Hello from bot via DM!");
```

---

## 🔍 Guild

```js
const guild = await client.getGuild("GUILD_ID");
const channels = await guild.fetchChannels();
const members = await guild.fetchMembers();

await guild.leave(); // Leave the server
```

---

## 📺 Channel

```js
const channel = await client.getChannel("CHANNEL_ID");
await channel.send("Message sent via channel.send()");
```

---

## 👤 Member

```js
await client.kickMember(guild_id, user_id, "Reason for kick");
await client.banMember(guild_id, user_id, "Reason for ban");
await client.unbanMember(guild_id, user_id);
```

---

## 🤝 Interaction (Slash Command, Button...)

```js
client.on("interactionCreate", async (interaction) => {
	await interaction.reply({ content: "Interaction received!" });
});
```

---

## 📝 Register Slash Command

```js
await client.registerGlobalCommand({
	name: "ping",
	description: "Replies with Pong!",
	type: 1, // CHAT_INPUT
});

// For a specific guild:
await client.registerGuildCommand("GUILD_ID", {
	name: "ping",
	description: "Replies with Pong!",
	type: 1,
});

await client.getGlobalCommands();

await client.getGuildCommands("GUILD_ID");
```

## Debug

```js
client.on("debug", (message) => {
	console.log(message);
});

client.on("raw", (message, d) => {
	console.log(message, d);
});
```

---

## 🛠 API Methods

| Method                                          | Description                     |
| ----------------------------------------------- | ------------------------------- |
| `getGuild(id)`                                  | Fetch guild info                |
| `getChannel(id)`                                | Fetch channel info              |
| `getMessage(channel_id, message_id)`            | Fetch specific message          |
| `getUser(id)`                                   | Fetch user info                 |
| `getDMChannel(user_id)`                         | Open/fetch DM channel           |
| `sendDM(user_id, content)`                      | Send a DM                       |
| `kickMember(guild_id, user_id)`                 | Kick member                     |
| `banMember(guild_id, user_id)`                  | Ban member                      |
| `unbanMember(guild_id, user_id)`                | Unban member                    |
| `sendMessage(channel_id, content)`              | Send a message to a channel     |
| `editMessage(message_id, channel_id, content)`  | Edit a message                  |
| `replyMessage(message_id, channel_id, content)` | Reply to a message              |
| `registerGlobalCommand(commandData)`            | Register a global slash command |
| `registerGuildCommand(guild_id, commandData)`   | Register guild slash command    |

---

## 💡 Notes

- The bot must have appropriate permissions to perform certain actions (send message, kick, ban...)
- `zdis` is a minimal client, not fully supporting all event types and data structures like `discord.js`

---

## 📄 License

MIT License
