<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / round

# Function: round()

```ts
function round(input: number, options: RoundOptions): number;
```

Defined in: [round.ts:30](https://github.com/technobuddha/library/blob/main/src/round.ts#L30)

Returns the nearest integer to the given number, with optional precision adjustments.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `number` | The number to round. |
| `options` | [`RoundOptions`](RoundOptions.md) | Optional configuration object. |

## Returns

`number`

The nearest integer to the adjusted input.

## Example

```typescript
round(2.3); // 2
round(2.7); // 3
round(-2.5); // -2
round(2.345, { precision: 2 }); // 2.35
round(-2.345, { precision: 2 }); // -2.35
```

