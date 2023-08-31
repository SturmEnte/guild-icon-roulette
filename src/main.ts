import "dotenv/config";
import { Client, ChannelType, Message } from "discord.js";
import axios from "axios";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const config = require("../config.json");

const client: Client = new Client({ intents: ["Guilds"] });

client.on("ready", () => {
	console.log("Client logged in as", client.user?.tag);

	changeImage();

	let changed = false;

	setInterval(() => {
		const date = new Date();
		if (date.getHours() == 0 && date.getMinutes() == 0 && !changed) {
			changeImage();
			changed = true;
		} else {
			changed = false;
		}
	}, 1000);
});

let lastImage = "";

async function changeImage() {
	console.log("Setting new image");

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
				if (Buffer.from(attachment.url, "utf8").toString("hex") != lastImage) images.push(attachment.url);
			});
		});

		options = { before: (<Message>newMessages.last()).id };
	}

	console.log("Images:\n" + images);

	const imageUrl = images[Math.floor(Math.random() * (images.length - 1 - 0 + 1) + 0)];
	console.log("Selected image:\n" + imageUrl);

	if (!fs.existsSync(path.join(__dirname, "../cache", Buffer.from(imageUrl).toString("hex")))) {
		const res = await axios({ url: imageUrl, method: "GET", responseType: "stream" });

		if (!fs.existsSync(path.join(__dirname, "../cache"))) fs.mkdirSync(path.join(__dirname, "../cache"));

		const download = res.data.pipe(fs.createWriteStream(path.join(__dirname, "../cache", Buffer.from(imageUrl).toString("hex"))));

		download.on("finish", () => {
			console.log("Successfully downloaded image:", imageUrl);
			editImage();
		});
	} else {
		editImage();
	}

	async function editImage() {
		const imageFile = fs.readFileSync(path.join(__dirname, "../cache", Buffer.from(imageUrl).toString("hex")));
		const topImageFile = fs.readFileSync(path.join(__dirname, "../", "top.png"));

		const topImage = await sharp(topImageFile).resize(2048, 2048).toBuffer();

		const image = await sharp(imageFile)
			.resize(2048, 2048)
			.composite([{ input: topImage }])
			.sharpen()
			.toBuffer();

		guild.setIcon(image).then(() => {
			lastImage = Buffer.from(imageUrl, "utf8").toString("hex");
			console.log("Successfully changed guild icon");
		});
	}
}

client.login(process.env.TOKEN);
