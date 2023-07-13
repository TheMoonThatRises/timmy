import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { eventMessageCache, imageCache, mapPickBanSideSelectCache, rolesCache, voteScrimTypeCache } from '../assets/caches.js';
import maps from '../assets/maps.js';
import { capitalise, drawEmpty, drawPick } from '../assets/drawImages.js';
import { createCanvas, loadImage } from 'canvas';

function genSelectOrder(scrimStyle) {
	const teamOrder = ['teamone', 'teamtwo'].sort(() => Math.random() - 0.5);

	/*
		Ban - Map Ban
		Select - Map Select
		Pick - Side Pick
	*/
	switch (scrimStyle) {
	case 'bo1':
		return [[teamOrder[0], 'ban'], [teamOrder[1], 'ban'], [teamOrder[0], 'ban'], [teamOrder[1], 'ban'], [teamOrder[0], 'ban'], [teamOrder[1], 'ban'], [teamOrder[0], 'pick']];
	case 'bo5':
		return [[teamOrder[0], 'ban'], [teamOrder[1], 'ban'], [teamOrder[0], 'select'], [teamOrder[1], 'pick'], [teamOrder[1], 'select'], [teamOrder[0], 'pick'], [teamOrder[0], 'select'], [teamOrder[1], 'pick'], [teamOrder[1], 'select'], [teamOrder[0], 'pick'], [teamOrder[1], 'pick']];
	case 'bo3':
	default:
		return [[teamOrder[0], 'ban'], [teamOrder[1], 'ban'], [teamOrder[0], 'select'], [teamOrder[1], 'pick'], [teamOrder[1], 'select'], [teamOrder[0], 'pick'], [teamOrder[0], 'ban'], [teamOrder[1], 'ban'], [teamOrder[0], 'pick']];
	}
}

export default async function(event, interaction) {
	if (!mapPickBanSideSelectCache.has(event.id)) {
		const scrimStyle = voteScrimTypeCache.get(event.id).final.toLowerCase();

		mapPickBanSideSelectCache.set(event.id, {
			'selected': [],
			'banned': [],
			'order': genSelectOrder(scrimStyle),
			'pos': 0,
		});

		imageCache.set(
			event.id,
			`./caches/images/${event.id}.png`,
		);

		await drawEmpty(
			mapPickBanSideSelectCache.get(event.id).order.map(element => [
				interaction.guild.roles.cache.get(rolesCache.get(event.id)[element[0]]).name,
				element[1],
			]),
			imageCache.get(event.id),
		);
	}

	const image = await loadImage(imageCache.get(event.id));
	const canvas = createCanvas(image.width / 2, image.height / 2);
	canvas.getContext('2d').scale(0.5, 0.5);
	canvas.getContext('2d').drawImage(image, 0, 0);

	const mapCache = mapPickBanSideSelectCache.get(event.id);

	const eventMessage = interaction.channel.messages.cache.get(eventMessageCache.get(event.id));

	console.log(mapCache.order.length);

	if (mapCache.order.length <= 0) {
		console.log('called message send new thing');
		return await eventMessage.edit({
			files: [new AttachmentBuilder(canvas.toBuffer(), { name: 'selection.png' })],
		});
	} else if (mapCache.order.length == 1) {
		console.log('drawing new pic');
		await drawPick(
			Object.keys(maps).filter(map => !mapCache.selected.concat(mapCache.banned).includes(map)),
			6,
			imageCache.get(event.id),
		);
	}

	console.log('going on to get team info');

	const team = interaction.guild.roles.cache.get(rolesCache.get(event.id)[mapCache.order[0][0]]);

	const isBan = mapCache.order[0][1] == 'ban';
	const isBanSelect = mapCache.order[0][1] != 'pick';

	const buttons = isBanSelect ? Object.keys(maps).map(map => !mapCache.selected.concat(mapCache.banned).includes(map) ?
		new ButtonBuilder()
			.setLabel(capitalise(map))
			.setCustomId(`${isBan ? 'mapban' : 'mapselection'}_${map}_${mapCache.order[0][0]}_${event.id}`)
			.setDisabled(mapCache.selected.concat(mapCache.banned).includes(map))
			.setStyle(ButtonStyle.Primary) : null,
	).filter(button => button) : ['Attack', 'Defense'].map(side => new ButtonBuilder()
		.setLabel(side)
		.setCustomId(`sideselection_${side.toLowerCase()}_${event.id}`)
		.setStyle(ButtonStyle.Primary),
	);

	const actionRows = [];

	if (buttons.length > 5) {
		actionRows.push(new ActionRowBuilder().addComponents(buttons.slice(0, 4)), new ActionRowBuilder().addComponents(buttons.slice(4)));
	} else {
		actionRows.push(new ActionRowBuilder().addComponents(buttons));
	}

	await eventMessage.edit({
		content: `Current team turn: <@&${team.id}>. Map ${isBanSelect ? (isBan ? 'ban' : 'selection') : 'side pick'}`,
		components: [...actionRows],
		files: [new AttachmentBuilder(canvas.toBuffer(), { name: 'selection.png' })],
	});
}
