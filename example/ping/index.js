const { Client } = require("zcord");

require("dotenv").config();

const client = new Client(process.env.TOKEN);

client.on("READY", () => {
	console.log(`Bot logged in as ${client.Me.username}`);
});

client.on("MESSAGE_CREATE", async (message) => {
	if (message.content === "ping") {
		const msg = await message.reply("pong");
		// Edit the message after 2 seconds
		setTimeout(() => {
			msg.edit("pong edited");
		}, 2000);
	}
});
