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
	intents: ["ALL"],
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

client.on("READY", () => {
	console.log(`Bot logged in as ${client.Me.username}`);
});

client.on("MESSAGE_CREATE", async (message) => {
	if (message.content === "newcomp") {
		const msg = await message.reply({
			flags: 32768,
			components: [
				{
					type: 10,
					content: "abcblabla",
				},
				{
					type: 12,
					items: [
						{
							media: {
								url: "https://github.com/user-attachments/assets/b2ee308e-2f46-4c20-86a6-c7f95108a86b?height=300&width=500",
							},
							description:
								"An aerial view of old broken buildings. Nature has begun to take root in the rooftops. A portion of the middle building's roof has collapsed inward. In the distant haze you can make out a far away city.",
						},
						{
							media: { url: "https://github.com/user-attachments/assets/4e191321-a7f5-4e73-865b-19c7bb8cbe5f" },
							description: "A street view of a downtown city. Prominently in photo are skyscrapers and a domed building",
						},
					],
				},
				{
					type: 10,
					content: "abcblabla",
				},
				{
					type: 12,
					items: [
						{
							media: {
								url: "https://raw.githubusercontent.com/zijipia/zijipia/Ziji-Discord-Bot-Image/Assets/Player.png",
							},
							description:
								"An aerial view looking down on older industrial complex buildings. The main building is white with many windows and pipes running up the walls.",
						},

						{
							media: { url: "https://github.com/user-attachments/assets/4e191321-a7f5-4e73-865b-19c7bb8cbe5f" },
							description: "A street view of a downtown city. Prominently in photo are skyscrapers and a domed building",
						},
					],
				},
			],
		});
	}
	if (message.content === "newcomp2") {
		await message.reply({
			flags: 32768,
			components: [
				{
					type: 17,
					accent_color: 703487,
					components: [
						{
							type: 10,
							content: "# You have encountered a wild coyote!",
						},
						{
							type: 12,
							items: [
								{
									media: {
										url: "https://images-ext-1.discordapp.net/external/J9k6nmXPR4vgx3sAAYpJxzO-CTWp6-QbeoZ5Bo72qCo/https/raw.githubusercontent.com/zijipia/zijipia/Ziji-Discord-Bot-Image/Assets/Player.png?format=webp&quality=lossless&width=503&height=592",
									},
								},
							],
						},
						{
							type: 10,
							content: "What would you like to do?",
						},
						{
							type: 1,
							components: [
								{
									type: 2,
									custom_id: "pet_coyote",
									label: "Pet it!",
									style: 1,
								},
								{
									type: 2,
									custom_id: "feed_coyote",
									label: "Attempt to feed it",
									style: 2,
								},
								{
									type: 2,
									custom_id: "run_away",
									label: "Run away!",
									style: 4,
								},
							],
						},
					],
				},
			],
		});
	}

	if (message.content === "newcomp3") {
		await message.reply({
			flags: 32768,
			components: [
				{
					type: 9,
					components: [
						{
							type: 10,
							content: "# Real Game v7.3",
						},
						{
							type: 10,
							content:
								"Hope you're excited, the update is finally here! Here are some of the changes:\n- Fixed a bug where certain treasure chests wouldn't open properly\n- Improved server stability during peak hours\n- Added a new type of gravity that will randomly apply when the moon is visible in-game\n- Every third thursday the furniture will scream your darkest secrets to nearby npcs",
						},
						{
							type: 10,
							content: "-# That last one wasn't real, but don't use voice chat near furniture just in case...",
						},
					],
					accessory: {
						type: 11,
						media: {
							url: "https://images-ext-1.discordapp.net/external/J9k6nmXPR4vgx3sAAYpJxzO-CTWp6-QbeoZ5Bo72qCo/https/raw.githubusercontent.com/zijipia/zijipia/Ziji-Discord-Bot-Image/Assets/Player.png?format=webp&quality=lossless&width=503&height=592",
						},
					},
				},
			],
		});
	}
});
