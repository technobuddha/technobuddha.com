<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Object](./index.md) / sortKeys

# Function: sortKeys()

```ts
function sortKeys<T>(object: T): T;
```

Defined in: [sort-keys.ts:24](https://github.com/technobuddha/library/blob/main/src/sort-keys.ts#L24)

Recursively sorts the keys of an object in lexicographical order.

If the input is a primitive value or an array, it is returned as-is.
For objects, all keys are sorted, and the function is applied recursively to all values.

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` *extends* [`TBJsonValue`](../JSON/TBJsonValue.md) | The type of the input value, extending JsonValue. |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `object` | `T` | The object or value whose keys should be sorted. |

## Returns

`T`

A new object with keys sorted, or the original value if it is a primitive or array.

## Example

```typescript
sortKeys(\{ b: 2, a: 1 \}); // returns \{ a: 1, b: 2 \}
sortKeys(\{ z: 1, y: \{ b: 2, a: 1 \} \}); // returns \{ y: \{ a: 1, b: 2 \}, z: 1 \}
sortKeys([\{ b: 2, a: 1 \}, \{ d: 4, c: 3 \}]); // returns [\{ a: 1, b: 2 \}, \{ c: 3, d: 4 \}]
sortKeys(42); // returns 42
```

