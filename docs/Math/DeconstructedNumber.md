<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / DeconstructedNumber

# Type Alias: DeconstructedNumber

```ts
type DeconstructedNumber = {
  exponent: number;
  mantissa: string;
  sign: 1 | -1;
  value: number;
};
```

Defined in: [@types/deconstructed-number.ts:6](https://github.com/technobuddha/library/blob/main/src/@types/deconstructed-number.ts#L6)

Represents a number that has been deconstructed into its mathematical components.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="exponent"></a> `exponent` | `number` | The exponent part of the number, indicating the power of 10 by which the mantissa is multiplied. | [src/@types/deconstructed-number.ts:14](https://github.com/technobuddha/library/blob/main/src/@types/deconstructed-number.ts#L14) |
| <a id="mantissa"></a> `mantissa` | `string` | The mantissa (or significand) part of the number, represented as a string. | [src/@types/deconstructed-number.ts:12](https://github.com/technobuddha/library/blob/main/src/@types/deconstructed-number.ts#L12) |
| <a id="sign"></a> `sign` | `1` \| `-1` | The sign of the number, where 1 indicates positive and -1 indicates negative. | [src/@types/deconstructed-number.ts:10](https://github.com/technobuddha/library/blob/main/src/@types/deconstructed-number.ts#L10) |
| <a id="value"></a> `value` | `number` | The original numeric value, rounded to the specified precision | [src/@types/deconstructed-number.ts:8](https://github.com/technobuddha/library/blob/main/src/@types/deconstructed-number.ts#L8) |

