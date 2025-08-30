<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / OrdinalOptions

# Type Alias: OrdinalOptions

```ts
type OrdinalOptions = {
  and?: Numbering["and"];
  denominators?: Numbering["denominators"];
  hyphen?: Numbering["hyphen"];
  ordinal?: Numbering["ordinal"];
  output?:   | "suffix"
     | "numeric"
     | "alphabetic"
     | "hybrid"
     | Numbering["output"];
  precision?: Numbering["precision"];
  shift?: Numbering["shift"];
  tolerance?: Numbering["tolerance"];
};
```

Defined in: [ordinal.ts:10](https://github.com/technobuddha/library/blob/main/src/ordinal.ts#L10)

Options for formatting ordinal numbers.

## Properties

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="and"></a> `and?` | [`Numbering`](Numbering.md)\[`"and"`\] | `(empty string)` | Text to use for "and" in compound numbers (e.g., "one hundred and one"). | [src/ordinal.ts:21](https://github.com/technobuddha/library/blob/main/src/ordinal.ts#L21) |
| <a id="denominators"></a> `denominators?` | [`Numbering`](Numbering.md)\[`"denominators"`\] | `'common'` | Type of denominators to use when expressing fractions. | [src/ordinal.ts:39](https://github.com/technobuddha/library/blob/main/src/ordinal.ts#L39) |
| <a id="hyphen"></a> `hyphen?` | [`Numbering`](Numbering.md)\[`"hyphen"`\] | `' ' (space)` | Text to use for hyphens in compound numbers (e.g., "twenty-one"). | [src/ordinal.ts:27](https://github.com/technobuddha/library/blob/main/src/ordinal.ts#L27) |
| <a id="ordinal"></a> `ordinal?` | [`Numbering`](Numbering.md)\[`"ordinal"`\] | `false` | Whether to output ordinal numbers (e.g., "first", "second") instead of cardinal numbers. | [src/ordinal.ts:51](https://github.com/technobuddha/library/blob/main/src/ordinal.ts#L51) |
| <a id="output"></a> `output?` | \| `"suffix"` \| `"numeric"` \| `"alphabetic"` \| `"hybrid"` \| [`Numbering`](Numbering.md)\[`"output"`\] | `'alphabetic'` | Output format for the number representation. | [src/ordinal.ts:15](https://github.com/technobuddha/library/blob/main/src/ordinal.ts#L15) |
| <a id="precision"></a> `precision?` | [`Numbering`](Numbering.md)\[`"precision"`\] | `9` | Precision for decimal/fraction conversion. | [src/ordinal.ts:45](https://github.com/technobuddha/library/blob/main/src/ordinal.ts#L45) |
| <a id="shift"></a> `shift?` | [`Numbering`](Numbering.md)\[`"shift"`\] | `undefined` | Whether to shift the fractional part of the number. | [src/ordinal.ts:56](https://github.com/technobuddha/library/blob/main/src/ordinal.ts#L56) |
| <a id="tolerance"></a> `tolerance?` | [`Numbering`](Numbering.md)\[`"tolerance"`\] | `0.01` | Tolerance for floating-point comparison when converting decimals to fractions. | [src/ordinal.ts:33](https://github.com/technobuddha/library/blob/main/src/ordinal.ts#L33) |

