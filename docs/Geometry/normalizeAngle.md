<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / normalizeAngle

# Function: normalizeAngle()

```ts
function normalizeAngle(angle: number, options: UnitOptions): number;
```

Defined in: [normalize-angle.ts:23](https://github.com/technobuddha/library/blob/main/src/normalize-angle.ts#L23)

Normalizes an angle to be in range 0-1 turns.

Angles outside this range will be normalized to be the equivalent angle with that range.
Angles are always returned as radians.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `angle` | `number` | Angle |
| `options` | [`UnitOptions`](UnitOptions.md) | see [UnitOptions](UnitOptions.md) |

## Returns

`number`

Standardized angle in radians.

## Example

```typescript
normalizeAngle(Math.PI); // π
normalizeAngle(2 * Math.PI); // 0
normalizeAngle(180, 'degrees'); // π
normalizeAngle(540, 'degrees'); // π
```

