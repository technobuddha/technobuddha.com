<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / midpoint

# Function: midpoint()

```ts
function midpoint(line: LineSegment, part: number): Cartesian;
```

Defined in: [midpoint.ts:16](https://github.com/technobuddha/library/blob/main/src/midpoint.ts#L16)

Calculates a point at a given fraction (`part`) along a line segment.  By default it returns the
true midpoint of the line segment

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `line` | [`LineSegment`](LineSegment.md) | `undefined` | The line segment defined by its start (`x0`, `y0`) and end (`x1`, `y1`) coordinates. |
| `part` | `number` | `0.5` | The fraction along the line segment at which to calculate the point (default is `0.5` for the midpoint). |

## Returns

[`Cartesian`](Cartesian.md)

The Cartesian coordinates of the calculated point.

## Example

```typescript
midpoint({ x0: 0, y0: 0, x1: 4, y1: 4 }); // { x: 2, y: 2 }
```

