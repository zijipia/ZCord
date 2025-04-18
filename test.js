const { Client } = require("./");
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
	// setTimeout(() => {
	// 	// client.cache._member.forEach((member) => {
	// 	// 	console.log(member.user.username);
	// 	// });
	// 	// client.getUser("661968947327008768").then((user) => {
	// 	// 	// console.log(user);
	// 	// 	user.send("hello world").then((message) => {
	// 	// 		console.log(message);
	// 	// 	});
	// 	// });
	// 	// client.cache._channel.forEach((channel) => {
	// 	// 	console.log(channel.name);
	// 	// });
	// }, 1000);
});

client.on("messageCreate", async (message) => {
	console.log("messageCreate:" + message?.type);
	if (message.content === "exit") {
		client.destroy();
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
