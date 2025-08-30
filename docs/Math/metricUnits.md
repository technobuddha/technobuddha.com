<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / metricUnits

# Function: metricUnits()

```ts
function metricUnits(input: number, options: MetricUnitsOptions): string;
```

Defined in: [metric-units.ts:95](https://github.com/technobuddha/library/blob/main/src/metric-units.ts#L95)

Abbreviate a number by adding a suffix for metric units (i.e. 1000 =\> 1K, .0001 = 1m)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `number` | The number to abbreviate |
| `options` | [`MetricUnitsOptions`](MetricUnitsOptions.md) | [MetricUnitsOptions](MetricUnitsOptions.md) |

## Returns

`string`

## Example

```typescript
metricUnits(1000); // '1K'
metricUnits(1500); // '1.5K'
metricUnits(0.001); // '1m'
metricUnits(0.000001); // '1µ'
metricUnits(123456789); // '123.46M'
metricUnits(0); // '0'
```

