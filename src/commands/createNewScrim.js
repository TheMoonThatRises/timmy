import axios from 'axios';
import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { scrimInfoCache } from '../../assets/caches.js';

export async function run(interaction) {
	await interaction.deferReply({ ephemeral: true });

	const startTime = interaction.options.get('unixdate').value;

	await interaction.guild.scheduledEvents.create({
		name: interaction.options.get('scrimname').value,
		scheduledStartTime: startTime,
		scheduledEndTime: startTime + 3 * 40 * 60 * 1000,
		privacyLevel: 2,
		entityType: 3,
		entityMetadata: { location: 'Right here' },
		image: Buffer.from((await axios.get(scrimInfoCache.get(interaction.guild.id).bannerimg, { responseType: 'arraybuffer' })).data, 'utf-8'),
		description: `${interaction.options.get('scrimdesc').value}. Timmy generated event.`,
	});

	await interaction.editReply('Created new event');
}

export const data = new SlashCommandBuilder()
	.setName('createnewscrim')
	.setDescription('Create a new scrim that is not automatically scheduled')
	.addIntegerOption(option => option
		.setName('unixdate')
		.setDescription('The time for the scrim in Unix Timestamp format')
		.setRequired(true),
	)
	.addStringOption(option => option
		.setName('scrimname')
		.setDescription('The name of the scrim to display on the event')
		.setRequired(true),
	)
	.addStringOption(option => option
		.setName('scrimdesc')
		.setDescription('Sets the description of the scrim event')
		.setRequired(true),
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents);
