<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / isClosed

# Function: isClosed()

```ts
function isClosed(polygon: Polygon): boolean;
```

Defined in: [is-closed.ts:13](https://github.com/technobuddha/library/blob/main/src/is-closed.ts#L13)

Determines whether a given polygon is closed.

A polygon is considered closed if it has more than one point and
its first and last points have identical `x` and `y` coordinates.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `polygon` | [`Polygon`](Polygon.md) | An array of points representing the polygon, where each point has `x` and `y` properties. |

## Returns

`boolean`

`true` if the polygon is closed; otherwise, `false`.

