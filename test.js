const Client = require("./");
require("dotenv").config();
const client = new Client(process.env.TOKEN, {
	identifyProperties: {
		os: "Discord Android",
		browser: "Discord Android",
		device: process.platform,
	},
	_init: true,
	intents: 3276799,
});

client.on("ready", () => {
	console.log(`Bot logged in as ${client.user.username}`);
	// client.registerGlobalCommand({
	// 	type: 1,
	// 	options: [],
	// });
	setTimeout(async () => {
		const user = await client.getUser("661968947327008768");
		// console.log(user.getAvatarURL());
		// client.commandManager.getGlobal().then((commands) => {
		// 	console.log("Global commands:", commands);
		// });
		// client.commandManager.clearGlobalCommands().then(() => {
		// 	console.log("Deleted command");
		// });
		// client.commandManager.registerGlobal([
		// 	{
		// 		name: "Play / Add music",
		// 		type: 3,
		// 		options: [],
		// 		integration_types: [0],
		// 		contexts: [0],
		// 	},
		// 	{
		// 		name: "Quote Image Generation",
		// 		type: 3,
		// 		options: [],
		// 		integration_types: [0, 1],
		// 		contexts: [0, 1],
		// 	},
		// 	{
		// 		name: "Translate",
		// 		type: 3,
		// 		options: [],
		// 		integration_types: [0, 1],
		// 		contexts: [0, 1],
		// 	},
		// 	{
		// 		name: "2048",
		// 		description: "Trò chơi giải đố",
		// 		type: 1,
		// 		integration_types: [0, 1],
		// 		contexts: [0, 1],
		// 	},
		// 	{
		// 		name: "fast-type",
		// 		description: "Kiểm tra trình độ gõ của bạn",
		// 		type: 1,
		// 		integration_types: [0, 1],
		// 		contexts: [0, 1],
		// 	},
		// 	{
		// 		name: "slots",
		// 		description: "Trò chơi slots",
		// 		type: 1,
		// 		integration_types: [0, 1],
		// 		contexts: [0, 1],
		// 	},
		// 	{
		// 		name: "snake",
		// 		description: "Trò chơi rắn săn mồi",
		// 		type: 1,
		// 		integration_types: [0, 1],
		// 		contexts: [0, 1],
		// 	},
		// 	{
		// 		name: "disconnect",
		// 		description: "Tắt nhạc và rời khỏi kênh thoại",
		// 		type: 1,
		// 		options: [],
		// 		integration_types: [0],
		// 		contexts: [0],
		// 	},
		// 	{
		// 		name: "launch",
		// 		description: "Launch app",
		// 		type: 4,
		// 		handler: 2,
		// 		integration_types: [0, 1],
		// 		contexts: [0, 1, 2],
		// 	},
		// ]);
		// client.commandManager.getGlobal().then((commands) => {
		// 	console.log("Global commands:", commands);
		// });
		// client.cache._member.forEach((member) => {
		// 	console.log(member.user.username);
		// });
		// client.getUser("661968947327008768").then((user) => {
		// 	// console.log(user);
		// 	user.send("hello world").then((message) => {
		// 		console.log(message);
		// 	});
		// });
		// client.cache._channel.forEach((channel) => {
		// 	console.log(channel.name);
		// });

		console.log(client.api);
	}, 1000);
});

client.on("messageCreate", async (message) => {
	console.log("messageCreate:" + message?.type + " " + message?.content);
	if (message.content === "exit") {
		client.destroy();
	}
	if (message.content === "!test") {
		const msg = await message.reply("Pong! 🏓");
		const user = await message.user;
		const avatar = user.getAvatarURL();

		user.send(avatar); //send DM
		(await message.channel).send(avatar); //send channel

		msg.edit(`${user.username} Avatar:`);
	}
	if (message.content === "ping") {
		const msg = await message.reply("pong");

		console.log(msg);
		msg.edit("pong pong");
	}
	if (message.content === "test") {
		const user = await message.user();
		user.send("hello world").then((message) => {
			console.log(message);
		});
	}
});

//interactionCreate
client.on("interactionCreate", (interaction) => {
	console.log("interactionCreate:" + interaction?.type);
	console.log(interaction);
});

// client.on("raw", (message, d) => {
// 	console.log(message, d);
// });

// client.on("debug", (...arg) => {
// 	console.log(...arg);
// });
