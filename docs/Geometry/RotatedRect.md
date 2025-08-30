<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / RotatedRect

# Type Alias: RotatedRect

```ts
type RotatedRect = Rect & {
  angle: number;
  area: number;
};
```

Defined in: [largest-inscribed-rectangle.ts:17](https://github.com/technobuddha/library/blob/main/src/largest-inscribed-rectangle.ts#L17)

Represents a rectangle that has been rotated by a certain angle.
Extends the `Rect` type with additional properties for the area and rotation angle.
const hull = convexHull(points);

## Type declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `angle` | `number` | [src/largest-inscribed-rectangle.ts:21](https://github.com/technobuddha/library/blob/main/src/largest-inscribed-rectangle.ts#L21) |
| `area` | `number` | [src/largest-inscribed-rectangle.ts:19](https://github.com/technobuddha/library/blob/main/src/largest-inscribed-rectangle.ts#L19) |

