import { existsSync, readFileSync, writeFileSync } from 'fs';

export default class Persistence extends Map {
	constructor(fileName) {
		super();

		this.file = `${fileName}.persistence.json`;

		if (!existsSync(this.file)) {
			writeFileSync(this.file, '{}');
		} else {
			const stored = JSON.parse(readFileSync(this.file));

			Object.entries(stored).forEach(([key, value]) => this.set(key, value));
		}
	}

	write() {
		writeFileSync(this.file, JSON.stringify(Object.fromEntries(this)));
	}

	set(key, value) {
		super.set(key, value);

		this.write();
	}

	delete(key) {
		if (this.has(key)) {
			super.delete(key);

			this.write();
		}
	}

	clear() {
		super.clear();

		this.write();
	}
}
