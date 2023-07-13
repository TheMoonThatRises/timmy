import 'dotenv/config';
import { Client, Events, GatewayIntentBits, Partials } from 'discord.js';

import { eventMessageCache, imageCache, mapPickBanSideSelectCache, rolesCache, voteScrimTypeCache } from '../assets/caches.js';

import { readdirSync, unlinkSync } from 'fs';

const client = new Client({
	intents: [
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildScheduledEvents,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildEmojisAndStickers,
	],
	partials: [Partials.GuildScheduledEvent,
		Partials.GuildMember,
		Partials.User,
	],
});

client.commands = new Map();
client.buttons = new Map();

client.once(Events.ClientReady, c => {
	readdirSync('./src/commands').forEach(async file => {
		const command = await import(`./commands/${file}`);

		client.application.commands
			.create(command.data)
			.catch(console.error);

		client.commands.set(command.data.name, command);
	});

	readdirSync('./src/buttons').forEach(async file => {
		const button = await import(`./buttons/${file}`);

		client.buttons.set(button.prefix, button);
	});

	console.log(`Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!client.isReady()) return;

	if (interaction.isCommand()) {
		await client.commands.get(interaction.commandName).run(interaction);
	} else if (interaction.isButton()) {
		await client.buttons.get(interaction.customId.split('_')[0]).run(interaction);
	} else if (interaction.isAutocomplete()) {
		await client.commands.get(interaction.commandName).autocomplete(interaction);
	}
});

client.on(Events.GuildScheduledEventDelete, event => {
	if (event.description.endsWith('Timmy generated event.')) {
		rolesCache.delete(event.id);
		voteScrimTypeCache.delete(event.id);
		mapPickBanSideSelectCache.delete(event.id);
		eventMessageCache.delete(event.id);
		unlinkSync(imageCache.get(event.id));
		imageCache.delete(event.id);
	}
});

client.login(process.env.TOKEN);
