import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { rolesCache } from '../../assets/caches.js';

export async function run(interaction) {
	await interaction.deferReply({ ephemeral: true });

	if (!interaction.client.channels.cache.get(interaction.options.get('scrimchannel').value).isVoiceBased()) {
		return await interaction.editReply('Scrim event must be hosted in a voice channel');
	}

	const event = await interaction.guild.scheduledEvents.create({
		name: interaction.options.get('scrimname').value,
		scheduledStartTime: interaction.options.get('unixdate').value,
		privacyLevel: 2,
		entityType: 2,
		description: `${interaction.options.get('scrimdesc').value}. Timmy generated event.`,
		channel: interaction.options.get('scrimchannel').value,
	});

	rolesCache.set(event.id, {
		'teamone': interaction.options.get('teamone').value,
		'teamtwo': interaction.options.get('teamtwo').value,
		'igl': interaction.options.get('igl').value,
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
	.addChannelOption(option => option
		.setName('scrimchannel')
		.setDescription('Sets the channel for the scrim to take place')
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
	.addRoleOption(option => option
		.setName('teamone')
		.setDescription('Role that team one has')
		.setRequired(true),
	)
	.addRoleOption(option => option
		.setName('teamtwo')
		.setDescription('Role that team two has')
		.setRequired(true),
	)
	.addRoleOption(option => option
		.setName('igl')
		.setDescription('Role that in-game leader has')
		.setRequired(true),
	)
	.addChannelOption(option => option
		.setName('messagechannel')
		.setDescription('Sets the channel to send scrim messages. By default it will be the VC channel')
		.setRequired(false),
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions);
