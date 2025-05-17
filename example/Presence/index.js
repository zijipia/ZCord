const { Client } = require("zcord");
require("dotenv").config();

const client = new Client(process.env.TOKEN, {
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
	//
	// other options...
});

client.on("READY", () => {
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
