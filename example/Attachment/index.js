const { Client, Attachment } = require("zcord");
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
