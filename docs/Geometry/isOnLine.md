<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / isOnLine

# Function: isOnLine()

```ts
function isOnLine(
   point: Cartesian, 
   line: LineSegment, 
   options: OnLineOptions): boolean;
```

Defined in: [is-on-line.ts:37](https://github.com/technobuddha/library/blob/main/src/is-on-line.ts#L37)

Determines whether a given point lies on a specified line segment or its extension.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `point` | [`Cartesian`](Cartesian.md) | The Cartesian coordinates of the point to test. |
| `line` | [`LineSegment`](LineSegment.md) | The line segment defined by its endpoints. |
| `options` | [`OnLineOptions`](OnLineOptions.md) | see [OnLineOptions](OnLineOptions.md) |

## Returns

`boolean`

`true` if the point lies on the line segment (or its extension if `extend` is true), otherwise `false`.

## Example

```typescript
isOnLine({ x: 2, y: 2 }, { x0: 0, y0: 0, x1: 4, y1: 4 }); // true
```

