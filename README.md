@trenskow/json-shards
----

A small JavaScript library for reading JSON files on disk that is laid as shards.

# How to use

The library is used as the example below.

````javascript
import { read } from '@trenskow/json-shards';

const { json } = await read('my.json');
````

With the files on disk as below.

> `my.json`

````json
{
	"some": "value"
}
````

> `my.key.json`

````json
{
	"key": {
		"another": 1
	}
}
````

> `my.key.nested.json`

````json
{
	"nested": "data"
}
````

The resulting json would look like the example below.

````json
{
	"some": "value",
	"key": {
		"another": 1,
		"nested": "data"
	}
}
````

# License

See license in LICENSE.
