<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / toRadians

# Function: toRadians()

```ts
function toRadians(angle: number, options: UnitOptions): number;
```

Defined in: [to-radians.ts:17](https://github.com/technobuddha/library/blob/main/src/to-radians.ts#L17)

Converts degrees to radians.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `angle` | `number` | Angle. |
| `options` | [`UnitOptions`](UnitOptions.md) | see [UnitOptions](UnitOptions.md) |

## Returns

`number`

Angle in radians.

## Example

```typescript
toRadians(180); // π
toRadians(90, 'degrees'); // π/2
toRadians(0.5, 'turns'); // π
```

