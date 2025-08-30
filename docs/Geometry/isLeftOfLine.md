<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / isLeftOfLine

# Function: isLeftOfLine()

```ts
function isLeftOfLine(point: Cartesian, line: LineSegment): boolean;
```

Defined in: [is-left-of-line.ts:18](https://github.com/technobuddha/library/blob/main/src/is-left-of-line.ts#L18)

Determines whether a given point lies to the left of a specified line segment.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `point` | [`Cartesian`](Cartesian.md) | The Cartesian point to test. |
| `line` | [`LineSegment`](LineSegment.md) | The line segment to compare against. |

## Returns

`boolean`

`true` if the point is to the left of the line segment; otherwise, `false`.

## Example

```typescript
isLeftOfLine({ x: 5, y: 5 }, { x0: 0, y0: 0, x1: 10, y1: 0 }); // true
```

