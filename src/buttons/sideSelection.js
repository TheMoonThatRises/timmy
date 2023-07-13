import { mapPickBanSideSelectCache, rolesCache } from '../../assets/caches.js';
import { drawSideSelection } from '../../assets/drawImages.js';
import mapStart from '../mapStart.js';

export async function run(interaction) {
	await interaction.deferReply({ ephemeral: true });

	const [, side, eventID] = interaction.customId.split('_');
	const mapCache = mapPickBanSideSelectCache.get(eventID);
	const team = interaction.guild.roles.cache.get(rolesCache.get(eventID)[mapCache.order[0][0]]);

	if (!interaction.member.roles.cache.has(team.id) && !interaction.member.roles.cache.has(rolesCache.get(eventID).igl)) {
		return await interaction.editReply('Only the igl of the team is allowed to vote');
	}

	await drawSideSelection(
		team.name,
		side,
		mapCache.selected.concat(mapCache.banned).length - 1,
		`./caches/images/${eventID}.png`,
	);

	mapCache.order.shift();
	await mapStart(interaction.guild.scheduledEvents.cache.get(eventID), interaction);

	await interaction.editReply(`Selected ${side}`);
}
export const prefix = 'sideselection';
