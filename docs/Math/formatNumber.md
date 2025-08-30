<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / formatNumber

# Function: formatNumber()

```ts
function formatNumber(input: number, mask: string): string;
```

Defined in: [format-number.ts:549](https://github.com/technobuddha/library/blob/main/src/format-number.ts#L549)

Formats a number according to the specified mask.

The mask can be a standard numeric format string (e.g., "C", "D", "E", "F", "G", "N", "P", "R", "X")
with an optional precision specifier, or a custom numeric format string with optional sections for
positive, negative, and zero values separated by semicolons.

Standard format specifiers:
- "C" or "c": Currency format.
- "D" or "d": Decimal format.
- "E" or "e": Scientific (exponential) format.
- "F" or "f": Fixed-point format.
- "G" or "g": General format (compact representation).
- "N" or "n": Number format with group separators.
- "P" or "p": Percent format.
- "R" or "r": Round-trip format (ensures that a number converted to a string and back again yields the same number).
- "X" or "x": Hexadecimal format.

Custom format strings can include digit placeholders, group separators, decimal points, and
optional sections for positive, negative, and zero values.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `number` | The number to format. |
| `mask` | `string` | The format mask string. |

## Returns

`string`

The formatted number as a string.

## Example

```typescript
formatNumber(1234.56, "C2"); // "$1,234.56"
formatNumber(-42, "D5");     // "-00042"
formatNumber(0.123, "P1");   // "12.3 %"
formatNumber(12345.678, "#,##0.00"); // "12,345.68"
```

