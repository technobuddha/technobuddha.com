<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / FractionOptions

# Type Alias: FractionOptions

```ts
type FractionOptions = {
  and?: Numbering["and"];
  denominators?: Numbering["denominators"];
  hyphen?: Numbering["hyphen"];
  ordinal?: Numbering["ordinal"];
  output?:   | "numeric"
     | "alphabetic"
     | "hybrid"
     | Numbering["output"];
  precision?: Numbering["precision"];
  shift?: Numbering["shift"];
  tolerance?: Numbering["tolerance"];
};
```

Defined in: [fraction.ts:9](https://github.com/technobuddha/library/blob/main/src/fraction.ts#L9)

Options for customizing the output and behavior of fraction number representations.

## Properties

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="and"></a> `and?` | [`Numbering`](Numbering.md)\[`"and"`\] | `(empty string)` | Text to use for "and" in compound numbers (e.g., "one hundred and one"). | [src/fraction.ts:20](https://github.com/technobuddha/library/blob/main/src/fraction.ts#L20) |
| <a id="denominators"></a> `denominators?` | [`Numbering`](Numbering.md)\[`"denominators"`\] | `'common'` | Type of denominators to use when expressing fractions. | [src/fraction.ts:38](https://github.com/technobuddha/library/blob/main/src/fraction.ts#L38) |
| <a id="hyphen"></a> `hyphen?` | [`Numbering`](Numbering.md)\[`"hyphen"`\] | `' ' (space)` | Text to use for hyphens in compound numbers (e.g., "twenty-one"). | [src/fraction.ts:26](https://github.com/technobuddha/library/blob/main/src/fraction.ts#L26) |
| <a id="ordinal"></a> `ordinal?` | [`Numbering`](Numbering.md)\[`"ordinal"`\] | `false` | Whether to output ordinal numbers (e.g., "first", "second") instead of cardinal numbers. | [src/fraction.ts:50](https://github.com/technobuddha/library/blob/main/src/fraction.ts#L50) |
| <a id="output"></a> `output?` | \| `"numeric"` \| `"alphabetic"` \| `"hybrid"` \| [`Numbering`](Numbering.md)\[`"output"`\] | `'alphabetic'` | Output format for the number representation. | [src/fraction.ts:14](https://github.com/technobuddha/library/blob/main/src/fraction.ts#L14) |
| <a id="precision"></a> `precision?` | [`Numbering`](Numbering.md)\[`"precision"`\] | `9` | Precision for decimal/fraction conversion. | [src/fraction.ts:44](https://github.com/technobuddha/library/blob/main/src/fraction.ts#L44) |
| <a id="shift"></a> `shift?` | [`Numbering`](Numbering.md)\[`"shift"`\] | `undefined` | Whether to shift the fractional part of the number. | [src/fraction.ts:56](https://github.com/technobuddha/library/blob/main/src/fraction.ts#L56) |
| <a id="tolerance"></a> `tolerance?` | [`Numbering`](Numbering.md)\[`"tolerance"`\] | `0.01` | Tolerance for floating-point comparison when converting decimals to fractions. | [src/fraction.ts:32](https://github.com/technobuddha/library/blob/main/src/fraction.ts#L32) |

