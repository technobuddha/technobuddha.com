<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / sum

# Function: sum()

```ts
function sum(numbers: number[]): number;
```

Defined in: [sum.ts:15](https://github.com/technobuddha/library/blob/main/src/sum.ts#L15)

Calculates the sum of an array of numbers.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `numbers` | `number`[] | An array of numbers to sum. |

## Returns

`number`

The total sum of all numbers in the array.

## Example

```typescript
sum([1, 2, 3, 4]); // 10
sum([-1, 1, -1, 1]); // 0
sum([]); // 0
sum([2.5, 3.5]); // 6
```

