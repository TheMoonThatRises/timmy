import { GuildScheduledEventStatus, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export async function run(interaction) {
	await interaction.deferReply({ ephemeral: true });

	const event = interaction.guild.scheduledEvents.cache.get(interaction.options.get('event').value);

	if (!event) {
		return await interaction.editReply('You must choose a valid event');
	}

	await interaction.editReply(`Cancelling event ${event.name} - ${event.id} scrim`);

	await event.setStatus(GuildScheduledEventStatus.Canceled, 'Scrim cancelled');
	await event.delete();
}
export async function autocomplete(interaction) {
	const focusedValue = interaction.options.getFocused();
	const choices = interaction.guild.scheduledEvents.cache.filter(event => event.isScheduled()).map(event => ({ 'name': event.name, 'value': event.id }));
	const filtered = choices.filter(event => event.name.startsWith(focusedValue));
	await interaction.respond(filtered);
}
export const data = new SlashCommandBuilder()
	.setName('cancelscrim')
	.setDescription('Cancels the scrim event')
	.addStringOption(option => option
		.setName('event')
		.setDescription('Which scrim to cancel')
		.setAutocomplete(true)
		.setRequired(true),
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions);
