<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / convexHull

# Function: convexHull()

```ts
function convexHull(vertices: Cartesian[]): undefined | Polygon;
```

Defined in: [convex-hull.ts:25](https://github.com/technobuddha/library/blob/main/src/convex-hull.ts#L25)

Computes the convex hull of a set of 2D points using the Monotone Chain algorithm.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertices` | [`Cartesian`](Cartesian.md)[] | An array of points. |

## Returns

`undefined` \| [`Polygon`](Polygon.md)

The convex hull as an array of points in counterclockwise order, or `undefined` if there are fewer than 3 vertices.

## See

[Monotone Chain](https://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain#JavaScript|)

## Example

```typescript
convexHull([
  { x: 0, y: 0 },
  { x: 1, y: 1 },
  { x: 2, y: 0 },
  { x: 1, y: -1 }
]);
// hull is now the convex hull of the points
```

## Remarks

- The returned array does not repeat the starting point at the end.
- Points on the edge of the hull may be included or excluded depending on their order.

