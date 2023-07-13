import { eventMessageCache, mapPickBanSideSelectCache, scrimInfoCache } from '../../assets/caches.js';
import { drawSideSelection } from '../../assets/drawImages.js';
import mapStart from '../mapStart.js';

export async function run(interaction) {
	const [, side, eventID] = interaction.customId.split('_');

	await interaction.channel.messages.cache.get(eventMessageCache.get(eventID)).edit({ components: [] });
	await interaction.deferReply({ ephemeral: true });

	const mapCache = mapPickBanSideSelectCache.get(eventID);
	const team = interaction.guild.roles.cache.get(scrimInfoCache.get(interaction.guild.id)[mapCache.order[0][0]]);

	if (!interaction.member.roles.cache.has(team.id) && !interaction.member.roles.cache.has(scrimInfoCache.get(interaction.guild.id).igl)) {
		return await interaction.editReply('Only the igl of the team is allowed to vote');
	}

	await drawSideSelection(
		team.name,
		side,
		mapCache.pos - 1,
		`./caches/images/${eventID}.png`,
	);

	mapCache.order.shift();
	await mapStart(interaction.guild.scheduledEvents.cache.get(eventID), interaction);

	await interaction.editReply(`Selected ${side}`);
}
export const prefix = 'sideselection';
