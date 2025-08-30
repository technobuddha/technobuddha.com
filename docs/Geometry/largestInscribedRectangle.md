<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / largestInscribedRectangle

# Function: largestInscribedRectangle()

```ts
function largestInscribedRectangle(polygon: Polygon, options: LargestInscribedRectUnitOptions): Rect | RotatedRect;
```

Defined in: [largest-inscribed-rectangle.ts:98](https://github.com/technobuddha/library/blob/main/src/largest-inscribed-rectangle.ts#L98)

Computes the largest rectangle that can be inscribed within the given polygon.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `polygon` | [`Polygon`](Polygon.md) | The polygon within which to inscribe the rectangle. |
| `options` | [`LargestInscribedRectUnitOptions`](LargestInscribedRectUnitOptions.md) | Configuration options for the computation. |

## Returns

[`Rect`](Rect.md) \| [`RotatedRect`](RotatedRect.md)

The largest inscribed rectangle.

## Throws

`Error` When polygon has fewer than 3 vertices

## Example

```typescript
const polygon: Polygon = [
  { x: 0, y: 0 },
  { x: 10, y: 0 },
  { x: 10, y: 10 },
  { x: 0, y: 10 }
];
const rect = largestInscribedRectangle(polygon, { aligned: true });
// rect: { x: 0, y: 0, width: 10, height: 10 }
```

