const { Client } = require("../../lib/index.js");

require("dotenv").config();

const client = new Client(process.env.TOKEN, {
	identifyProperties: {
		os: "Discord Android",
		browser: "Discord Android",
		device: process.platform,
	},
});

client.on("READY", () => {
	console.log(`Bot logged in as ${client.Me.username}`);
});

client.on("MESSAGE_CREATE", async (message) => {
	if (message.content === "test") {
		const user = await client.getUser("661968947327008768");
		const avatar = user.getAvatarURL();
		user.send(avatar); //send DM
	}
});

client.on("debug", console.log); //log debug messages
