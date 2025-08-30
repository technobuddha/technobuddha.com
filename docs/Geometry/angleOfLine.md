<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / angleOfLine

# Function: angleOfLine()

```ts
function angleOfLine(line: LineSegment, options: UnitOptions): number;
```

Defined in: [angle-of-line.ts:19](https://github.com/technobuddha/library/blob/main/src/angle-of-line.ts#L19)

Calculates the angle of a given line segment, relative to the horizontal axis

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `line` | [`LineSegment`](LineSegment.md) | The line segment for which to calculate the angle. |
| `options` | [`UnitOptions`](UnitOptions.md) | see [UnitOptions](UnitOptions.md) |

## Returns

`number`

The angle of the line segment in the specified units.

## Example

```ts
angleOfLine({ x0: 0, y0: 0, x1: 10, y1: 10 }); // π/4
angleOfLine({ x0: 0, y0: 0, x1: 10, y1: 10 }, 'degrees'); // 45
```

