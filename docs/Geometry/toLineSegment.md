<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / toLineSegment

# Function: toLineSegment()

```ts
function toLineSegment(pointA: Cartesian, pointB: Cartesian): LineSegment;
```

Defined in: [to-line-segment.ts:11](https://github.com/technobuddha/library/blob/main/src/to-line-segment.ts#L11)

Converts two Cartesian points into a `LineSegment` object.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pointA` | [`Cartesian`](Cartesian.md) | The starting point of the line segment. |
| `pointB` | [`Cartesian`](Cartesian.md) | The ending point of the line segment. |

## Returns

[`LineSegment`](LineSegment.md)

A `LineSegment` object representing the line from `pointA` to `pointB`.

