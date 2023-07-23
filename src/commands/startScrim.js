import { GuildScheduledEventStatus, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import voteStart from '../voteStart.js';

export async function run(interaction) {
	await interaction.deferReply({ ephemeral: true });

	const event = interaction.guild.scheduledEvents.cache.get(interaction.options.get('event').value);

	if (!event) {
		return await interaction.editReply('You must choose a valid event');
	}

	await interaction.editReply(`Starting event ${event.name} - ${event.id} scrim early`);

	event.setStatus(GuildScheduledEventStatus.Active, 'Scrim started');

	voteStart(event);
}
export async function autocomplete(interaction) {
	const focusedValue = interaction.options.getFocused();
	const choices = interaction.guild.scheduledEvents.cache.filter(event => event.isScheduled() || event.isActive()).map(event => ({ 'name': event.name, 'value': event.id }));
	const filtered = choices.filter(event => event.name.startsWith(focusedValue));
	await interaction.respond(filtered);
}
export const data = new SlashCommandBuilder()
	.setName('startscrim')
	.setDescription('Start a scrim')
	.addStringOption(option => option
		.setName('event')
		.setDescription('Which scrim to start')
		.setAutocomplete(true)
		.setRequired(true),
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents);
