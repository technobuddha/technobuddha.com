<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / toCartesian

# Function: toCartesian()

```ts
function toCartesian(point: Polar, options: UnitOptions): Cartesian;
```

Defined in: [to-cartesian.ts:18](https://github.com/technobuddha/library/blob/main/src/to-cartesian.ts#L18)

Convert polar coordinates to cartesian

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `point` | [`Polar`](Polar.md) | radius, angle in radians (zero points in +X direction). |
| `options` | [`UnitOptions`](UnitOptions.md) | see [UnitOptions](UnitOptions.md) |

## Returns

[`Cartesian`](Cartesian.md)

Object containing the X and Y-distance for the angle and radius.

## Example

```typescript
toCartesian({ r: 1, φ: Math.PI / 4 }); // { x: √2/2, y: √2/2 }
toCartesian({ r: 1, φ: 90 }, 'degrees'); // { x: 0, y: 1 }
```

