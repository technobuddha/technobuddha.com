<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Object](./index.md) / isIterator

# Function: isIterator()

```ts
function isIterator(obj: unknown): obj is Iterator<unknown, unknown, unknown>;
```

Defined in: [is-iterator.ts:18](https://github.com/technobuddha/library/blob/main/src/is-iterator.ts#L18)

Determines whether the provided object conforms to the Iterator interface.

An object is considered an iterator if it is not `null` or `undefined` and has a `next` method of type `function`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `obj` | `unknown` | The object to test for iterator compliance. |

## Returns

`obj is Iterator<unknown, unknown, unknown>`

`true` if the object is an iterator, otherwise `false`.

## Example

```typescript
const arr = [1, 2, 3];
const iter = arr[Symbol.iterator]();
isIterator(iter); // true
isIterator(arr);  // false
isIterator(null); // false
```

