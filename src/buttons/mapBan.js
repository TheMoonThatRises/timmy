import { mapPickBanSideSelectCache, rolesCache } from '../../assets/caches.js';
import { drawBan } from '../../assets/drawImages.js';
import mapStart from '../mapStart.js';

export async function run(interaction) {
	await interaction.deferReply({ ephemeral: true });

	const [, map, team, eventID] = interaction.customId.split('_');
	const mapCache = mapPickBanSideSelectCache.get(eventID);

	if (!interaction.member.roles.cache.has(rolesCache.get(eventID)[team]) && !interaction.member.roles.cache.has(rolesCache.get(eventID).igl)) {
		return await interaction.editReply('Only the igl of the team is allowed to vote');
	}

	await drawBan(
		map,
		mapCache.pos,
		`./caches/images/${eventID}.png`,
	);

	mapPickBanSideSelectCache.get(eventID).banned.push(map);

	mapCache.order.shift();
	mapCache.pos++;
	await mapStart(interaction.guild.scheduledEvents.cache.get(eventID), interaction);

	await interaction.editReply(`Banned ${map}`);
}
export const prefix = 'mapban';
