<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / star

# Function: star()

```ts
function star(
   sides: number, 
   outer: number, 
   inner: number, 
   options: OriginOptions): Polygon;
```

Defined in: [star.ts:29](https://github.com/technobuddha/library/blob/main/src/star.ts#L29)

Generates a star-shaped polygon.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sides` | `number` | `3` | The number of points (arms) of the star. Must be at least 3. |
| `outer` | `number` | `1` | The radius from the origin to the outer vertices (tips) of the star. |
| `inner` | `number` | `...` | The radius from the origin to the inner vertices (indentations) of the star. Defaults to half of `outer`. |
| `options` | [`OriginOptions`](OriginOptions.md) | `{}` | see [OriginOptions](OriginOptions.md) |

## Returns

[`Polygon`](Polygon.md)

A star shaped polygon.

## Throws

`TypeError` If `sides` is less than 3.

## Example

```typescript
star(4, 2, 1);
// [
//   { x: 2, y: 0 },
//   { x: √2/2, y: √2/2 },
//   { x: 0, y: 2 },
//   { x: -√2/2, y: √2/2 },
//   { x: -2, y: 0 },
//   { x: -√2/2, y: -√2/2 },
//   { x: 0, y: -2 },
//   { x: √2/2, y: -√2/2 }
// ]
```

