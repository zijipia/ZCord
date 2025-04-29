const { Client, Attachment } = require("zcord");
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
	presence: {
		activities: [
			{
				name: "Zcordjs",
				type: 2,
			},
		],
		status: "online",
		since: Date.now(),
		afk: false,
	},
});

client.on("ready", () => {
	console.log(`Bot logged in as ${client.user.username}`);
});

client.on("messageCreate", async (message) => {
	if (message.content === "test") {
		const user = await client.getUser("661968947327008768");
		const avatar = user.getAvatarURL();
		user.send(avatar); //send DM
	}
});
