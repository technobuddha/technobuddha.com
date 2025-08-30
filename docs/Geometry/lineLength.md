<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / lineLength

# Function: lineLength()

```ts
function lineLength(line: LineSegment): number;
```

Defined in: [line-length.ts:14](https://github.com/technobuddha/library/blob/main/src/line-length.ts#L14)

Calculates the length of a line segment.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `line` | [`LineSegment`](LineSegment.md) | The line segment for which to calculate the length. |

## Returns

`number`

The length of the line segment.

## Example

```typescript
lineLength({ x0: 0, y0: 0, x1: 3, y1: 4 }); // 5
```

