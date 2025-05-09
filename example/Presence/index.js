const { Client } = require("../../lib/index.js");
const fs = require("fs");

require("dotenv").config();

const client = new Client(process.env.TOKEN, {
	identifyProperties: {
		os: "Discord Android",
		browser: "Discord Android",
		device: process.platform,
	},
	_init: true,
	intents: 3276799,
	// presence: {
	// 	// activities: [
	// 	// 	{
	// 	// 		name: "Zcordjs",
	// 	// 		type: 2,
	// 	// 	},
	// 	// ],
	// 	status: "online",
	// 	since: Date.now(),
	// 	afk: false,
	// },
});

client.on("ready", () => {
	console.log(`Bot logged in as ${client.Me.username}`);
	client.Me.presence({
		activities: [
			{
				name: "Zcordjs",
				type: 3,
			},
		],
		status: "idle",
		since: 2000,
		afk: false,
	});
});

client.on("messageCreate", async (message) => {
	if (message.content === "test") {
		const user = await client.getUser("661968947327008768");
		const avatar = user.getAvatarURL();
		user.send(avatar); //send DM
	}
});

client.on("debug", console.log); //log debug messages
