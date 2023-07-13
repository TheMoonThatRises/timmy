import { createCanvas, loadImage, registerFont } from 'canvas';
import { writeFileSync } from 'fs';
import maps from './maps.js';

const title = { x: 598, y: 198 };
const body = { x: 598, y: 898 };
const border = 4;

registerFont('./assets/fonts/valorant.ttf', { family: 'valorant' });

export const capitalise = (string) => string[0].toUpperCase() + string.slice(1);

async function drawMap(map, pos, path, isVeto) {
	const image = await loadImage(path);

	const canvas = createCanvas(image.width, image.height);
	const ctx = canvas.getContext('2d');

	ctx.drawImage(image, 0, 0);

	const xMin = title.x * pos + border * pos;

	const mapImage = await loadImage(maps[map]);

	ctx.globalAlpha = isVeto ? 0.3 : 0.7;

	ctx.drawImage(mapImage, mapImage.width / 2 - body.x / 2, mapImage.height / 2 - body.y / 2, body.x, body.y, xMin, title.y + border, body.x, body.y);

	ctx.globalAlpha = 1.0;

	ctx.font = '100px valorant';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = 'rgb(227, 229, 253)';

	ctx.fillText(capitalise(map), xMin + body.x / 2, title.y + border + body.y / 2);

	if (isVeto) {
		const veto = await loadImage('./assets/images/templates/veto.png');
		ctx.drawImage(veto, xMin + body.x / 2 - veto.width / 2, title.y + border + body.y / 2 - veto.height / 2);
	}

	writeFileSync(path, canvas.toBuffer());
}

export async function drawEmpty(selection, path) {
	const image = await loadImage('./assets/images/templates/boxes.png');

	const canvas = createCanvas(image.width, image.height);
	const ctx = canvas.getContext('2d');

	ctx.drawImage(image, 0, 0);

	selection = selection.filter(element => element[1] != 'pick');

	ctx.font = '64px valorant';
	ctx.fillStyle = 'rgb(227, 229, 253)';
	ctx.textAlign = 'center';

	for (let i = 0; i < selection.length; ++i) {
		const element = selection[i];

		const xMin = title.x * i + border * i;

		ctx.textBaseline = 'bottom';

		ctx.fillText(capitalise(element[0]), xMin + title.x / 2, title.y / 2);

		ctx.textBaseline = 'top';

		ctx.fillText(`Map ${element[1]}`, xMin + title.x / 2, title.y / 2);

		if (i == selection.length - 1) {
			ctx.textBaseline = 'bottom';

			ctx.fillText('Decider', xMin + title.x + title.x / 2, title.y / 2);

			ctx.textBaseline = 'top';

			ctx.fillText('Map', xMin + title.x + title.x / 2, title.y / 2);
		}
	}

	writeFileSync(path, canvas.toBuffer());
}
export const drawBan = async (map, pos, path) => drawMap(map, pos, path, true);
export const drawPick = async (map, pos, path) => drawMap(map, pos, path, false);
export async function drawSideSelection(team, side, pos, path) {
	const image = await loadImage(path);

	const canvas = createCanvas(image.width, image.height);
	const ctx = canvas.getContext('2d');

	ctx.drawImage(image, 0, 0);

	const xMin = title.x * pos + border * pos;

	ctx.font = '64px valorant';
	ctx.fillStyle = 'rgb(227, 229, 253)';
	ctx.textAlign = 'center';

	const pick = await loadImage('./assets/images/templates/pick.png');

	ctx.drawImage(pick, xMin, body.y);

	ctx.textBaseline = 'bottom';

	ctx.fillText(`${team} Picks`, xMin + title.x / 2, body.y + title.y / 2);

	ctx.textBaseline = 'top';

	ctx.fillText(capitalise(side), xMin + title.x / 2, body.y + title.y / 2);

	writeFileSync(path, canvas.toBuffer());
}
