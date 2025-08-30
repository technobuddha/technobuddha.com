<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / fraction

# Function: fraction()

```ts
function fraction(input: number, options: FractionOptions): string;
```

Defined in: [fraction.ts:79](https://github.com/technobuddha/library/blob/main/src/fraction.ts#L79)

Converts a numeric input into a formatted fraction string, either in numeric or alphabetic form.

The function finds the closest matching fraction from a predefined list and formats the output
based on the specified options. If the input is negative, the result is prefixed accordingly.
The output can be either a numeric representation (e.g., "1 1⁄2") or an alphabetic representation
(e.g., "one and one half").

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `number` | The number to convert to a fraction string. |
| `options` | [`FractionOptions`](FractionOptions.md) | An optional object specifying the output format. |

## Returns

`string`

The formatted fraction string.

## Example

```typescript
fraction(1.5); // "one and one half"
fraction(2.75, { output: 'numeric' }); // "2 3⁄4"
fraction(-0.25, { output: 'alphabetic' }); // "negative one quarter"
fraction(0.333, { precision: 2 }); // "one third"
```

