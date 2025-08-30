<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / normalizeLineSegment

# Function: normalizeLineSegment()

```ts
function normalizeLineSegment(line: LineSegment): LineSegment;
```

Defined in: [normalize-line-segment.ts:12](https://github.com/technobuddha/library/blob/main/src/normalize-line-segment.ts#L12)

Returns a [LineSegment](LineSegment.md) where the point with the higher y-coordinate is always the starting point (x0, y0).
If the original line's y1 is greater than y0, the line is returned as-is.
Otherwise, the start and end points are swapped.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `line` | [`LineSegment`](LineSegment.md) | The line segment to process. |

## Returns

[`LineSegment`](LineSegment.md)

A [LineSegment](LineSegment.md) with the topmost point as the starting point.

