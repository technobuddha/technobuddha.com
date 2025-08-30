<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / toClosed

# Function: toClosed()

```ts
function toClosed(polygon: Polygon): Polygon;
```

Defined in: [to-closed.ts:12](https://github.com/technobuddha/library/blob/main/src/to-closed.ts#L12)

Ensures that a given polygon is closed by checking if the first and last points are the same.
If the polygon is not closed, it appends the first point to the end of the array.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `polygon` | [`Polygon`](Polygon.md) | The array of points representing the polygon. |

## Returns

[`Polygon`](Polygon.md)

A closed polygon, where the first and last points are identical.

