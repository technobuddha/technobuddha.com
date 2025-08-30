<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Random](./index.md) / randomPick

# Function: randomPick()

```ts
function randomPick<T>(list: readonly T[], random: () => number): undefined | T;
```

Defined in: [random-pick.ts:15](https://github.com/technobuddha/library/blob/main/src/random-pick.ts#L15)

Pick a random items from a list.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `list` | readonly `T`[] | `undefined` | Array of items to pick from |
| `random` | () => `number` | `Math.random` | Random number generator |

## Returns

`undefined` \| `T`

Randomly selected item

## Example

```typescript
const items = ['a', 'b', 'c'];
randomPick(items, () => 0.5); // 'b' (deterministic for example)
randomPick([], () => 0.5); // undefined
```

