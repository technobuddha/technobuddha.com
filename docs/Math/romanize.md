<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / romanize

# Function: romanize()

```ts
function romanize(input: number, options: RomanOptions): string;
```

Defined in: [romanize.ts:32](https://github.com/technobuddha/library/blob/main/src/romanize.ts#L32)

Convert a number into a roman numeral string

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `number` | The number to turn into a roman numeral |
| `options` | [`RomanOptions`](RomanOptions.md) | see [RomanOptions](RomanOptions.md) |

## Returns

`string`

Converted roman numeral

## Example

```typescript
toRoman(1); // "I"
toRoman(4); // "IV"
toRoman(9); // "IX"
toRoman(2024); // "MMXXIV"
toRoman(49, { format: 'apostrophus' }); // "IL"
```

