const { Client, Attachment } = require("zcord");
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
	if (message.content === "ping") {
		message.reply("pong");
	}
	if (message.content === "test") {
		const file1 = new Attachment("./Attachment/nyan-cat.gif", { name: "cat.gif" });

		const file2 = await Attachment.fromUrl(message.user.getAvatarURL(), { name: "zavt.gif" });
		message.reply({
			content: "Tài liệu đính kèm:",
			files: [file1, file2],
			embeds: [
				{
					title: "meow cat",
					color: "12255487",
					description: "This is an embedded message.",

					thumbnail: {
						url: "attachment://zavt.gif",
					},
					image: {
						url: "attachment://cat.gif",
					},
				},
			],
		});
	}
});
