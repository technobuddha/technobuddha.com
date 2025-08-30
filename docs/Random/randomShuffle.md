<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Random](./index.md) / randomShuffle

# Function: randomShuffle()

```ts
function randomShuffle<T>(deck: readonly T[], random: () => number): T[];
```

Defined in: [random-shuffle.ts:19](https://github.com/technobuddha/library/blob/main/src/random-shuffle.ts#L19)

Returns a new array with the elements of the input array shuffled in random order.

Uses the Fisher-Yates (Knuth) shuffle algorithm to ensure an unbiased shuffle.

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of elements in the array. |

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `deck` | readonly `T`[] | `undefined` | The array of items to shuffle. The original array is not modified. |
| `random` | () => `number` | `Math.random` | A function that returns a random number in the range [0, 1). Defaults to `Math.random`. |

## Returns

`T`[]

A new array containing the shuffled elements.

## Example

```typescript
const items = [1, 2, 3];
randomShuffle(items, () => 0.5); // deterministic shuffle for example
// result could be: [2, 3, 1]
randomShuffle([]); // []
```

