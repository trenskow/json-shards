//
// index.js
// @trenskow/json-shards
//
// Created by Kristian Trenskow on 2026/10/01
// For license see LICENSE.
//

import keyd from 'keyd';

import {
	dirname,
	basename,
	extname
} from 'node:path';

import {
	readFile,
	readdir
} from 'node:fs/promises';

const read = async (path) => {

	const directory = dirname(path);
	const extension = extname(path);
	const name = basename(path, extension);

	const shards = (await readdir(directory))
		.filter(file => file.startsWith(name) && file.endsWith(extension))
		.map((shard) => shard.substring(
			name.length,
			shard.length - extension.length))
		.map((shard) => shard.split('.').filter((part) => part.length))
		.filter((shard) => shard.length)
		.sort((a, b) => a.length - b.length);

	const json = await JSON.parse(await readFile(path, 'utf-8'));

	if (typeof json !== 'object' || json === null) {
		throw new Error(`Data at \`${path}\` must be an object.`);
	}

	for (const shard of shards) {
		keyd(json).set(
			shard,
			await JSON.parse(await readFile(`${directory}/${name}.${shard.join('.')}${extension}`, 'utf-8')));
	}

	return {
		json,
		shards: shards
			.map((shard) => shard.join('.'))
	};

};

export { read };
