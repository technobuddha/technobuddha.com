<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / standardDeviation

# Function: standardDeviation()

```ts
function standardDeviation(...dataPoints: number[]): number;
```

Defined in: [standard-deviation.ts:19](https://github.com/technobuddha/library/blob/main/src/standard-deviation.ts#L19)

Returns the sample [Standard Deviation](https://en.wikipedia.org/wiki/Standard_deviation) of the arguments.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`dataPoints` | `number`[] | samples to analyze. |

## Returns

`number`

The sample standard deviation of the arguments (0 if fewer
than two samples were provided, or NaN if any of the samples is
not a valid number).

## Example

```typescript
standardDeviation(2, 4, 4, 4, 5, 5, 7, 9); // 2
standardDeviation(1, 1, 1, 1); // 0
standardDeviation(); // 0
standardDeviation(1, 2, NaN); // NaN
```

