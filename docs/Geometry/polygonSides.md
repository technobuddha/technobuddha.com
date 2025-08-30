<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / polygonSides

# Function: polygonSides()

```ts
function polygonSides(polygon: Polygon): Generator<LineSegment>;
```

Defined in: [polygon-sides.ts:13](https://github.com/technobuddha/library/blob/main/src/polygon-sides.ts#L13)

Generate line segments for each side of the polygon.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `polygon` | [`Polygon`](Polygon.md) | The polygon to extract sides from |

## Returns

[`Generator`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Generator)\<[`LineSegment`](LineSegment.md)\>

Generator that yields line segments for each edge

