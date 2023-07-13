import { eventMessageCache, rolesCache, voteScrimTypeCache } from '../../assets/caches.js';
import mapStart from '../mapStart.js';

async function updateVoteCount(eventID, interaction) {
	const scrimCache = voteScrimTypeCache.get(eventID);
	const currentVoteCount = Object.values(scrimCache.votes).flat().length;
	const eventMessage = interaction.channel.messages.cache.get(eventMessageCache.get(eventID));
	const event = interaction.guild.scheduledEvents.cache.get(eventID);

	eventMessage.edit(eventMessage.content.slice(0, eventMessage.content.lastIndexOf('.', eventMessage.content.lastIndexOf('.') - 1)) + `. **${currentVoteCount}/2 votes**.`);

	if (currentVoteCount >= 2) {
		const finalCounts = Object.keys(scrimCache.votes).map(key => ({ 'type': key, 'count': scrimCache.votes[key].length }));
		voteScrimTypeCache.get(eventID).final = finalCounts.reduce((prev, next) => prev.count > next.count ? prev : next).type;
		voteScrimTypeCache.write();
		mapStart(event, interaction);
	}
}

export async function run(interaction) {
	await interaction.deferReply({ ephemeral: true });

	const [, vote, eventID] = interaction.customId.split('_');

	const voteArr = voteScrimTypeCache.get(eventID).votes;
	const userID = interaction.user.id;

	if (!interaction.member.roles.cache.has(rolesCache.get(eventID).igl)) {
		return await interaction.editReply('Only igls are allowed to vote');
	}

	if (!Object.values(voteArr).flat().includes(userID)) {
		voteArr[vote].push(userID);

		updateVoteCount(eventID, interaction);

		return await interaction.editReply(`Vote for ${vote} added`);
	} else if (voteArr[vote].includes(userID)) {
		return await interaction.editReply(`You have already voted for ${vote}`);
	}

	let alreadyVoted = '';

	Object.keys(voteArr).forEach(key => {
		if (key == vote) {
			voteArr[vote].push(userID);
		} else {
			if (voteArr[vote].includes(userID)) {
				alreadyVoted = key;
			}

			voteArr[vote] = voteArr[vote].filter(id => id != userID);
		}
	});

	updateVoteCount(eventID, interaction);

	return await interaction.editReply(`Switched vote from ${alreadyVoted} to ${vote}`);
}
export const prefix = 'roundvote';
