<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / variance

# Function: variance()

```ts
function variance(...dataPoints: number[]): number;
```

Defined in: [variance.ts:20](https://github.com/technobuddha/library/blob/main/src/variance.ts#L20)

Returns the unbiased sample [Variance](https://en.wikipedia.org/wiki/Variance) of the arguments.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`dataPoints` | `number`[] | Number samples to analyze. |

## Returns

`number`

The unbiased sample variance of the arguments (0 if fewer
than two samples were provided, or `NaN` if any of the samples is
not a valid number).

## Example

```typescript
variance(2, 4, 4, 4, 5, 5, 7, 9); // 4
variance(1, 1, 1, 1); // 0
variance(); // NaN
variance(1, 2, NaN); // NaN
```

