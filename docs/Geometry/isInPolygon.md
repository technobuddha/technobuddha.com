<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / isInPolygon

# Function: isInPolygon()

```ts
function isInPolygon(object: Cartesian | Rect | Polygon, polygon: Polygon): boolean;
```

Defined in: [is-in-polygon.ts:31](https://github.com/technobuddha/library/blob/main/src/is-in-polygon.ts#L31)

Determines whether a given point or rectangle is inside or on the edge of a polygon.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `object` | [`Cartesian`](Cartesian.md) \| [`Rect`](Rect.md) \| [`Polygon`](Polygon.md) | The point or rectangle to test. |
| `polygon` | [`Polygon`](Polygon.md) | The polygon to test against, represented as an array of Cartesian coordinates. |

## Returns

`boolean`

`true` if the object is inside the polygon or on its edge, otherwise `false`.

## Example

```typescript
isInPolygon(
  { x: 5, y: 5 },
  [{ x: 0, y: 0 }, { x: 10, y: 0}, { x: 10, y: 10 }, { x: 0, y: 10 }]
); // true
```

## Remarks

- The polygon is assumed to be a simple, non-self-intersecting polygon.
- Points on the edge of the polygon return `true`.
- For rectangles, all corners must be inside the polygon.
- Uses ray-casting algorithm with explicit edge detection.

