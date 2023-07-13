import { eventMessageCache, imageCache, mapPickBanSideSelectCache, scrimInfoCache } from '../../assets/caches.js';
import { drawPick } from '../../assets/drawImages.js';
import mapStart from '../mapStart.js';

export async function run(interaction) {
	const [, map, team, eventID] = interaction.customId.split('_');

	await interaction.channel.messages.cache.get(eventMessageCache.get(eventID)).edit({ components: [] });
	await interaction.deferReply({ ephemeral: true });

	const mapCache = mapPickBanSideSelectCache.get(eventID);

	if (!interaction.member.roles.cache.has(scrimInfoCache.get(interaction.guild.id)[team]) && !interaction.member.roles.cache.has(scrimInfoCache.get(interaction.guild.id).igl)) {
		return await interaction.editReply('Only the igl of the team is allowed to vote');
	}

	await drawPick(
		map,
		mapCache.pos,
		imageCache.get(eventID),
		`./caches/images/${eventID}.png`,
	);

	mapPickBanSideSelectCache.get(eventID).selected.push(map);

	mapCache.order.shift();
	mapCache.pos++;
	await mapStart(interaction.guild.scheduledEvents.cache.get(eventID), interaction);

	await interaction.editReply(`Selected ${map}`);
}
export const prefix = 'mapselection';
