<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / isRightOfLine

# Function: isRightOfLine()

```ts
function isRightOfLine(point: Cartesian, line: LineSegment): boolean;
```

Defined in: [is-right-of-line.ts:19](https://github.com/technobuddha/library/blob/main/src/is-right-of-line.ts#L19)

Determines whether a given point lies to the right of a specified line segment.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `point` | [`Cartesian`](Cartesian.md) | The Cartesian point to test. |
| `line` | [`LineSegment`](LineSegment.md) | The line segment to compare against. |

## Returns

`boolean`

`true` if the point is to the right of the line segment; otherwise, `false`.

## Example

```typescript
isRightOfLine({ x: 2, y: 2 }, { x0: 0, y0: 0, x1: 4, y1: 4 }); // false
isRightOfLine({ x: 3, y: 1 }, { x0: 0, y0: 0, x1: 4, y1: 4 }); // true
```

