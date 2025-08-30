<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / angleBetweenPoints

# Function: angleBetweenPoints()

```ts
function angleBetweenPoints(
   a: Cartesian, 
   b: Cartesian, 
   options: UnitOptions): number;
```

Defined in: [angle-between-points.ts:22](https://github.com/technobuddha/library/blob/main/src/angle-between-points.ts#L22)

Computes the angle between two points (x1,y1) and (x2,y2).
Angle zero points in the +X direction, π/2 radians points in the +Y
direction (down) and from there we grow clockwise towards π*2 radians.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `a` | [`Cartesian`](Cartesian.md) | first point. |
| `b` | [`Cartesian`](Cartesian.md) | second. |
| `options` | [`UnitOptions`](UnitOptions.md) | see [UnitOptions](UnitOptions.md) |

## Returns

`number`

Standardized angle of the vector from *a* to *b*.

## Example

```typescript
angleBetweenPoints({ x: 0, y: 0 }, { x: 10, y: 0 }); // 0
angleBetweenPoints({ x: 0, y: 0 }, { x: 10, y: 10 }); // π/4
angleBetweenPoints({ x: 0, y: 0 }, { x: 0, y: 10 }, 'deg'); // 45
```

