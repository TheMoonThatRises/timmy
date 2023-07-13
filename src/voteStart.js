import { ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildScheduledEventStatus } from 'discord.js';
import { eventMessageCache, voteScrimTypeCache } from '../assets/caches.js';

export default async function(event) {
	if (!event.isActive()) {
		event.setStatus(GuildScheduledEventStatus.Active, 'Scrim started');
	}

	const scrimLengths = ['Bo1', 'Bo3', 'Bo5'];

	let grammarScrims = scrimLengths.join(', ');
	grammarScrims = grammarScrims.slice(0, grammarScrims.lastIndexOf(',')) + `, or ${scrimLengths[scrimLengths.length - 1]}`;

	const buttons = scrimLengths.map(type => new ButtonBuilder()
		.setLabel(type)
		.setCustomId(`roundvote_${type.toLowerCase()}_${event.id}`)
		.setStyle(ButtonStyle.Primary),
	);

	voteScrimTypeCache.set(event.id, {
		'votes': { 'bo1': [], 'bo3': [], 'bo5': [] },
		'final': '',
	});

	const message = await event.channel.send({
		content: `Vote for the scrim type of **${grammarScrims}**. Vote will end when both igls voted. **0/2 votes**.`,
		components: [new ActionRowBuilder().addComponents(buttons)],
	});

	eventMessageCache.set(event.id, message.id);
}
