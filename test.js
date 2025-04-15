const { Client } = require("./");
require("dotenv").config();
const client = new Client(process.env.TOKEN);

client.on("ready", () => {
	console.log(`Bot logged in as ${client.user.username}`);
	client.registerGlobalCommand({
		name: "blep",
		type: 1,
		description: "Send a random adorable animal photo",
		options: [
			{
				name: "animal",
				description: "The type of animal",
				type: 3,
				required: true,
				choices: [
					{
						name: "Dog",
						value: "animal_dog",
					},
					{
						name: "Cat",
						value: "animal_cat",
					},
					{
						name: "Penguin",
						value: "animal_penguin",
					},
				],
			},
			{
				name: "only_smol",
				description: "Whether to show only baby animals",
				type: 5,
				required: false,
			},
		],
	});
});
client.on("message", (message) => {
	console.log(message.content);
});

client.on("messageCreate", (message) => {
	console.log(message.content);
});

//interactionCreate
client.on("interactionCreate", (interaction) => {
	console.log(interaction);
});

// client.on("raw", (message, d) => {
// 	console.log(message, d);
// });

client.on("debug", (message) => {
	console.log(message);
});
