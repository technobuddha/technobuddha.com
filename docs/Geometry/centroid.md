<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / centroid

# Function: centroid()

```ts
function centroid(vertices: Polygon): Cartesian;
```

Defined in: [centroid.ts:26](https://github.com/technobuddha/library/blob/main/src/centroid.ts#L26)

Calculates the centroid (geometric center) of a polygon.

The centroid is computed using the formula for the centroid of a non-self-intersecting closed polygon.
The vertices should be provided in order (either clockwise or counterclockwise).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertices` | [`Polygon`](Polygon.md) | An array of points representing the vertices of the polygon. |

## Returns

[`Cartesian`](Cartesian.md)

The centroid as a Cartesian coordinate.

## Example

```typescript
centroid([
  { x: 0, y: 0 },
  { x: 0, y: 5 },
  { x: 10, y: 5 },
  { x: 10, y: 0 },
]);
// { x: 5, y: 2.5 }
```

## Remarks

The function assumes the polygon is non-self-intersecting.

