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
	setTimeout(() => {
		// client.cache._member.forEach((member) => {
		// 	console.log(member.user.username);
		// });
		client.getUser("661968947327008768").then((user) => {
			// console.log(user);
			user.send("hello world").then((message) => {
				console.log(message);
			});
		});
		// client.cache._channel.forEach((channel) => {
		// 	console.log(channel.name);
		// });
	}, 1000);
});

client.on("messageCreate", (message) => {
	console.log("messageCreate:" + message?.type);
	console.log(message);
	if (message.content === "exit") {
		client.destroy();
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

client.on("debug", (...arg) => {
	console.log(...arg);
});
