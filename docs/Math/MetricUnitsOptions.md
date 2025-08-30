<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / MetricUnitsOptions

# Type Alias: MetricUnitsOptions

```ts
type MetricUnitsOptions = {
  format?: string;
  macro?: ArrayLike<string>;
  micro?: ArrayLike<string>;
  pad?: number;
  precision?: number;
  unit?: number;
};
```

Defined in: [metric-units.ts:52](https://github.com/technobuddha/library/blob/main/src/metric-units.ts#L52)

Options for the [metricUnits](metricUnits.md) function
w

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="format"></a> `format?` | `string` | format specification to pass to [formatNumber](formatNumber.md) | [src/metric-units.ts:56](https://github.com/technobuddha/library/blob/main/src/metric-units.ts#L56) |
| <a id="macro"></a> `macro?` | `ArrayLike`\<`string`\> | Array of suffixes to use for large values (default: ['K', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y']) | [src/metric-units.ts:64](https://github.com/technobuddha/library/blob/main/src/metric-units.ts#L64) |
| <a id="micro"></a> `micro?` | `ArrayLike`\<`string`\> | Array of suffixed to use for small values (default: ['m', 'µ', 'n', 'p', 'f', 'a', 'z', 'y']) | [src/metric-units.ts:68](https://github.com/technobuddha/library/blob/main/src/metric-units.ts#L68) |
| <a id="pad"></a> `pad?` | `number` | left padding to apply to numeric value | [src/metric-units.ts:60](https://github.com/technobuddha/library/blob/main/src/metric-units.ts#L60) |
| <a id="precision"></a> `precision?` | `number` | Number of digits after the decimal point to display | [src/metric-units.ts:76](https://github.com/technobuddha/library/blob/main/src/metric-units.ts#L76) |
| <a id="unit"></a> `unit?` | `number` | Multiplier for each level of suffixes (default: 1000) | [src/metric-units.ts:72](https://github.com/technobuddha/library/blob/main/src/metric-units.ts#L72) |

