import "dotenv/config";
import { Client } from "discord.js";

const client: Client = new Client({ intents: ["Guilds"] });

client.on("ready", () => {
	console.log("Client logged in as", client.user?.tag);
});

client.login(process.env.TOKEN);
