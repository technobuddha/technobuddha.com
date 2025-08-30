<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / cardinal

# Function: cardinal()

```ts
function cardinal(input: number, options: CardinalOptions): string;
```

Defined in: [cardinal.ts:76](https://github.com/technobuddha/library/blob/main/src/cardinal.ts#L76)

Convert a number into text (the cardinal number)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `number` | The number |
| `options` | [`CardinalOptions`](CardinalOptions.md) | see [CardinalOptions](CardinalOptions.md) |

## Returns

`string`

The number spelled out

## Remarks

There is no limit to the numbers that can be expressed, however Javascript/Typescript can only represent numbers
up to uncentillions (1e308).

## Example

```typescript
cardinal(123); // "one hundred twenty three"
cardinal(123, { hyphen: '-' }); // "one hundred twenty-three"
cardinal(42.5, { output: 'alphabetic' }); // "forty two and one half"
cardinal(101, { and: ' and ' }); // "one hundred and one"
cardinal(3.14159, { precision: 2 }); // "three and fourteen hundredths"
```

