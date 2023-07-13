import { GuildScheduledEventStatus, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export async function run(interaction) {
	await interaction.deferReply({ ephemeral: true });

	const event = interaction.guild.scheduledEvents.cache.get(interaction.options.get('event').value);

	if (!event) {
		return await interaction.editReply('You must choose a valid event');
	}

	await interaction.editReply(`Ending event ${event.name} - ${event.id} scrim early`);

	await event.setStatus(GuildScheduledEventStatus.Completed, 'Scrim ended');
	await event.delete();
}
export async function autocomplete(interaction) {
	const focusedValue = interaction.options.getFocused();
	const choices = interaction.guild.scheduledEvents.cache.filter(event => event.isActive()).map(event => ({ 'name': event.name, 'value': event.id }));
	const filtered = choices.filter(event => event.name.startsWith(focusedValue));
	await interaction.respond(filtered);
}
export const data = new SlashCommandBuilder()
	.setName('endscrim')
	.setDescription('Ends the scrim event early')
	.addStringOption(option => option
		.setName('event')
		.setDescription('Which scrim to end early')
		.setAutocomplete(true)
		.setRequired(true),
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions);
