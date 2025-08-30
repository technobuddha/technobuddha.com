<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / floor

# Function: floor()

```ts
function floor(input: number, options: FloorOptions): number;
```

Defined in: [floor.ts:31](https://github.com/technobuddha/library/blob/main/src/floor.ts#L31)

Returns the largest integer less than or equal to the given number, with optional tolerance and precision adjustments.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `number` | The number to floor. |
| `options` | [`FloorOptions`](FloorOptions.md) | Optional settings for the operation. |

## Returns

`number`

The floored number, adjusted for tolerance and precision.

## Example

```typescript
floor(2.7); // 2
floor(-2.7); // -3
floor(2.999, { tolerance: 0.001 }); // 2
floor(2.345, { precision: 2 }); // 2.34
```

