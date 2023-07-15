import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { scrimInfoCache } from '../../assets/caches.js';

async function checkImage(url) {
	try {
		const res = await fetch(url);
		const buff = await res.blob();

		return buff.type.startsWith('image/');
	} catch {
		return false;
	}
}

export async function run(interaction) {
	await interaction.deferReply({ ephemeral: true });

	const scrimChannel = interaction.options.get('scrimchannel').value;
	const teamone = interaction.options.get('teamone').value;
	const teamtwo = interaction.options.get('teamtwo').value;
	const igl = interaction.options.get('igl').value;
	const bannerimg = interaction.options.get('bannerimg')?.value;

	if (!interaction.client.channels.cache.get(scrimChannel).isTextBased()) {
		return await interaction.editReply('Scrim channel must be a text based channel');
	} else if (!interaction.guild.members.me.permissionsIn(interaction.guild.channels.cache.get(scrimChannel)).has([PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel])) {
		return await interaction.editReply('Scrim channel must be visible and accessible to timmy');
	} else if (bannerimg && !await checkImage(bannerimg)) {
		return await interaction.editReply('Banner image must be a valid url');
	}

	scrimInfoCache.set(interaction.guild.id, {
		'channel': scrimChannel,
		'teamone': teamone,
		'teamtwo': teamtwo,
		'igl': igl,
		'bannerimg': bannerimg,
	});

	await interaction.editReply(`Set scrim channel to <#${scrimChannel}>, team one role to <@&${teamone}>, team two role to <@&${teamtwo}>, and igl role to <@&${igl}>`);
}

export const data = new SlashCommandBuilder()
	.setName('setscriminfo')
	.setDescription('Sets information about future scrims such as channel and team roles')
	.addChannelOption(option => option
		.setName('scrimchannel')
		.setDescription('Sets the channel to send scrim messages')
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
	.addStringOption(option => option
		.setName('bannerimg')
		.setDescription('Sets the event banner image')
		.setRequired(false),
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents);
