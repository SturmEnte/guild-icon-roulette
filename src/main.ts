import "dotenv/config";
import { Client, ChannelType, Message } from "discord.js";

const config = require("../config.json");

const client: Client = new Client({ intents: ["Guilds"] });

client.on("ready", () => {
	console.log("Client logged in as", client.user?.tag);

	changeImage();
});

async function changeImage() {
	const guild = await client.guilds.fetch(config.guild_id);
	const channel = await guild.channels.fetch(config.image_channel_id);

	if (!channel) {
		console.log("Channel not found");
		return;
	}

	if (channel.type != ChannelType.GuildText) {
		console.log("Channel has wrong type");
		return;
	}

	let images = new Array<string>();

	let options = {};

	while (true) {
		const newMessages = await channel.messages.fetch(options);

		if (!newMessages.last()) {
			break;
		}

		newMessages.forEach((message) => {
			const attachments = message.attachments.filter((attachment) => attachment.contentType?.startsWith("image"));
			attachments.forEach((attachment) => {
				images.push(attachment.url);
			});
		});

		options = { before: (<Message>newMessages.last()).id };
	}

	console.log(images);
}

client.login(process.env.TOKEN);