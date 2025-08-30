<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / mode

# Function: mode()

```ts
function mode<T>(array: T[]): undefined | T;
```

Defined in: [mode.ts:18](https://github.com/technobuddha/library/blob/main/src/mode.ts#L18)

Returns the mode (the most frequently occurring element) of the given array.
If multiple elements have the same highest frequency, the first encountered is returned.
Returns `undefined` if the array is empty.

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of elements in the input array. |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `array` | `T`[] | The array of elements to find the mode of. |

## Returns

`undefined` \| `T`

The mode of the array, or `undefined` if the array is empty.

## Example

```typescript
mode([1, 2, 2, 3, 3, 3, 4]); // 3
mode(['a', 'b', 'b', 'a', 'c']); // 'a'
mode([true, false, false, true, true]); // true
mode([]); // undefined
```

