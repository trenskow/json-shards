//
// index.js
// @trenskow/json-shards
//
// Created by Kristian Trenskow on 2026/10/01
// For license see LICENSE.
//

import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';

use(chaiAsPromised);

import {
	read
} from '../lib/index.js';

describe('json-shards', () => {

	it('should read a JSON file and shards.', () => {
		return expect(read('test/data/test.json')).to.eventually.deep.equal({
			json: {
				file: 'test.json',
				a: {
					file: 'test.a.json'
				},
				b: {
					file: 'test.b.json',
					a: {
						file: 'test.b.a.a.json',
						a: {
							file: 'test.a.a.json'
						}
					},
					b: {
						file: 'test.b.b.json'
					}
				}
			},
			shards: [
				'a',
				'b',
				'b.a',
				'b.b',
				'b.a.a'
			]
		});
	});

});
