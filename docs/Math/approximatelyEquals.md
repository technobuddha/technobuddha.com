<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / approximatelyEquals

# Function: approximatelyEquals()

```ts
function approximatelyEquals(
   a: number, 
   b: number, 
   options: ApproximatelyEqualsOptions): boolean;
```

Defined in: [approximately-equals.ts:30](https://github.com/technobuddha/library/blob/main/src/approximately-equals.ts#L30)

Tests whether the two values are equal to each other, within a certain
tolerance, taking into account floating point errors (numbers within EPSILON).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `a` | `number` | First number to compare. |
| `b` | `number` | Second number to compare. |
| `options` | [`ApproximatelyEqualsOptions`](ApproximatelyEqualsOptions.md) | see [ApproximatelyEqualsOptions](ApproximatelyEqualsOptions.md) |

## Returns

`boolean`

true if *a* and *b* are nearly equal.

## Default Value

```ts
tolerance 0
```

## Example

```typescript
approximatelyEquals(0.1 + 0.2, 0.3); // true (floating point rounding)
approximatelyEquals(100, 100.0000001); // true
approximatelyEquals(100, 100.1); // false
approximatelyEquals(5, 7, { tolerance: 2 }); // true
approximatelyEquals(5, 8, { tolerance: 2 }); // false
```

