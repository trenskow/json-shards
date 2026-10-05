//
// index.js
// @trenskow/json-shards
//
// Created by Kristian Trenskow on 2025/12/19
// For license see LICENSE.
//

import keyd from 'keyd';
import merge from '@trenskow/merge';

import {
	dirname,
	basename,
	extname
} from 'node:path';

import {
	readFile,
	readdir,
	writeFile
} from 'node:fs/promises';

class JSONShards {

	static async read(filename) {

		const directory = dirname(filename);
		const extension = extname(filename);
		const name = basename(filename, extension);

		const json = JSON.parse(await readFile(filename, 'utf8'));

		const shards = (await readdir(directory))
			.filter(file => file.startsWith(name + '.'))
			.filter(file => file.endsWith(extension))
			.map(file => file.substring(name.length + 1, file.length - extension.length))
			.sort((a, b) => a.split('.').length - b.split('.').length);

		for (const shard of shards) {
			keyd(json)
				.set(
					JSON.parse(
						await readFile(
							`${directory}/${name}.${shard}${extension}`,
							'utf8')));
		}

		return new JSONShards({ shards, json, filename });

	}

	constructor({
		shards,
		json,
		filename
	}) {
		this.shards = shards;
		this.json = json;
		this.filename = filename;
	}

	async write() {

		const copy = merge({}, this.json);

		const directory = dirname(this.filename);
		const extension = extname(this.filename);
		const name = basename(this.filename, extension);

		for (const shard of this.shards) {

			const shardJSON = keyd(copy)
				.get(shard);

			keyd(copy)
				.delete(shard);

			await writeFile(
				`${directory}/${name}.${shard}${extension}`, JSON.stringify(shardJSON, null, 2), 'utf8');

		}

		await writeFile(this.filename, JSON.stringify(copy, null, 2), 'utf8');

	}

};

export default JSONShards;
