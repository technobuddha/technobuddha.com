<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / isIntersecting

# Function: isIntersecting()

```ts
function isIntersecting(shape: LineSegment | Polygon, polygon: Polygon): boolean;
```

Defined in: [is-intersecting.ts:34](https://github.com/technobuddha/library/blob/main/src/is-intersecting.ts#L34)

Determines whether a given shape (either a LineSegment or a Polygon) intersects with a polygon.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `shape` | [`LineSegment`](LineSegment.md) \| [`Polygon`](Polygon.md) | The shape to test for intersection, which can be either a LineSegment or a Polygon. |
| `polygon` | [`Polygon`](Polygon.md) | The polygon to test against. |

## Returns

`boolean`

`true` if the shape intersects with the polygon, otherwise `false`.

## Example

```typescript
isIntersecting(
  { x0: -1, y0: 0.5, x1: 2, y1: 0.5 },
  [ { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 } ],
); // true
isIntersecting(
  [ { x: 0, y: 0 }, { x: 2, y: 0 },  { x: 1, y: 2 } ],
  [ { x: 1, y: 1 }, { x: 3, y: 1 }, { x: 3, y: 3 }, { x: 1, y: 3 } ],
); // true
```

## Remarks

- If `shape` is a Polygon, the function checks if any of its edges intersect with the given polygon,
  or if two of its vertices lie on the polygon.
- If `shape` is a LineSegment, the function checks if it intersects with any edge of the polygon,
  or if both endpoints of a polygon edge lie on the line segment.

