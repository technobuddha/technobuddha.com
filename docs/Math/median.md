<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / median

# Function: median()

```ts
function median(numbers: number[]): number;
```

Defined in: [median.ts:21](https://github.com/technobuddha/library/blob/main/src/median.ts#L21)

Calculates the median value of an array of numbers.

The median is the middle number in a sorted, ascending or descending, list of numbers.
If the list has an even number of elements, the median is the average of the two middle numbers.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `numbers` | `number`[] | An array of numbers to find the median of. |

## Returns

`number`

The median value, or `NaN` if the input array is empty.

## Example

```typescript
median([1, 2, 3]); // 2
median([1, 2, 3, 4]); // 2.5
median([7, 1, 3, 5]); // 4
median([]); // NaN
```

