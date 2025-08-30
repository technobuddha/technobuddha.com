<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [JSON](./index.md) / JSONMap

# Class: JSONMap\<K, V\>

Defined in: [json-map.ts:25](https://github.com/technobuddha/library/blob/main/src/json-map.ts#L25)

A [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) that allows serializable objects keys.

`JSONMap` serializes keys using JSON.serialize, enabling the use of complex objects as map keys,
similar to how `Map` allows objects, but with value-based equality rather than reference-based.

## Example

```typescript
const map = new JSONMap<{ id: number }, string>();
map.set({ id: 1 }, "one");
map.get({ id: 1 }); // "one"
```

## Remarks

- Keys are serialized using JSON, so only JSON-safe objects should be used as keys.
- Key equality is determined by the serialized JSON string, not by object reference.
- Circular references in keys are not supported.

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `K` *extends* `JsonObject` | The type of the key, which must extend `JsonObject`. |
| `V` | The type of the value. |

## Implements

- [`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`K`, `V`\>

## Constructors

### Constructor

```ts
new JSONMap<K, V>(values?: 
  | null
| Iterable<[K, V], any, any>): JSONMap<K, V>;
```

Defined in: [src/json-map.ts:28](https://github.com/technobuddha/library/blob/main/src/json-map.ts#L28)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `values?` | \| `null` \| [`Iterable`](https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html#iterable-interface)\<\[`K`, `V`\], `any`, `any`\> |

#### Returns

`JSONMap`\<`K`, `V`\>

## Properties

| Property | Modifier | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="tostringtag"></a> `[toStringTag]` | `readonly` | `"JSONMap"` | `'JSONMap'` | [src/json-map.ts:36](https://github.com/technobuddha/library/blob/main/src/json-map.ts#L36) |

## Accessors

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [src/json-map.ts:38](https://github.com/technobuddha/library/blob/main/src/json-map.ts#L38)

##### Returns

`number`

the number of elements in the Map.

#### Implementation of

```ts
Map.size
```

## Methods

### \[iterator\]()

```ts
iterator: MapIterator<[K, V]>;
```

Defined in: [src/json-map.ts:88](https://github.com/technobuddha/library/blob/main/src/json-map.ts#L88)

#### Returns

`MapIterator`\<\[`K`, `V`\]\>

#### Implementation of

```ts
Map.[iterator]
```

***

### clear()

```ts
clear(): void;
```

Defined in: [src/json-map.ts:42](https://github.com/technobuddha/library/blob/main/src/json-map.ts#L42)

#### Returns

`void`

#### Implementation of

```ts
Map.clear
```

***

### delete()

```ts
delete(value: K): boolean;
```

Defined in: [src/json-map.ts:46](https://github.com/technobuddha/library/blob/main/src/json-map.ts#L46)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `K` |

#### Returns

`boolean`

true if an element in the Map existed and has been removed, or false if the element does not exist.

#### Implementation of

```ts
Map.delete
```

***

### entries()

```ts
entries(): MapIterator<[K, V]>;
```

Defined in: [src/json-map.ts:50](https://github.com/technobuddha/library/blob/main/src/json-map.ts#L50)

Returns an iterable of key, value pairs for every entry in the map.

#### Returns

`MapIterator`\<\[`K`, `V`\]\>

#### Implementation of

```ts
Map.entries
```

***

### forEach()

```ts
forEach(callback: (value: V, key: K, map: JSONMap<K, V>) => void, thisArg?: unknown): void;
```

Defined in: [src/json-map.ts:56](https://github.com/technobuddha/library/blob/main/src/json-map.ts#L56)

Executes a provided function once per each key/value pair in the Map, in insertion order.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `callback` | (`value`: `V`, `key`: `K`, `map`: `JSONMap`\<`K`, `V`\>) => `void` |
| `thisArg?` | `unknown` |

#### Returns

`void`

#### Implementation of

```ts
Map.forEach
```

***

### get()

```ts
get(key: K): undefined | V;
```

Defined in: [src/json-map.ts:65](https://github.com/technobuddha/library/blob/main/src/json-map.ts#L65)

Returns a specified element from the Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `K` |

#### Returns

`undefined` \| `V`

Returns the element associated with the specified key. If no element is associated with the specified key, undefined is returned.

#### Implementation of

```ts
Map.get
```

***

### has()

```ts
has(value: K): boolean;
```

Defined in: [src/json-map.ts:69](https://github.com/technobuddha/library/blob/main/src/json-map.ts#L69)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `K` |

#### Returns

`boolean`

boolean indicating whether an element with the specified key exists or not.

#### Implementation of

```ts
Map.has
```

***

### keys()

```ts
keys(): MapIterator<K>;
```

Defined in: [src/json-map.ts:73](https://github.com/technobuddha/library/blob/main/src/json-map.ts#L73)

Returns an iterable of keys in the map

#### Returns

`MapIterator`\<`K`\>

#### Implementation of

```ts
Map.keys
```

***

### set()

```ts
set(key: K, value: V): this;
```

Defined in: [src/json-map.ts:79](https://github.com/technobuddha/library/blob/main/src/json-map.ts#L79)

Adds a new element with a specified key and value to the Map. If an element with the same key already exists, the element will be updated.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `K` |
| `value` | `V` |

#### Returns

`this`

#### Implementation of

```ts
Map.set
```

***

### values()

```ts
values(): MapIterator<V>;
```

Defined in: [src/json-map.ts:84](https://github.com/technobuddha/library/blob/main/src/json-map.ts#L84)

Returns an iterable of values in the map

#### Returns

`MapIterator`\<`V`\>

#### Implementation of

```ts
Map.values
```

