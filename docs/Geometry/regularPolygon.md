<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / regularPolygon

# Function: regularPolygon()

```ts
function regularPolygon(
   sides: number, 
   radius: number, 
   options: OriginOptions): Polygon;
```

Defined in: [regular-polygon.ts:24](https://github.com/technobuddha/library/blob/main/src/regular-polygon.ts#L24)

Generates a regular polygon.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sides` | `number` | `3` | The number of sides of the polygon (must be at least 3). |
| `radius` | `number` | `1` | The radius of the polygon (distance from the origin to each vertex). |
| `options` | [`OriginOptions`](OriginOptions.md) | `{}` | see [OriginOptions](OriginOptions.md) |

## Returns

[`Polygon`](Polygon.md)

A regular polygon.

## Throws

`TypeError` If the number of sides is less than 3.

## Example

```typescript
regularPolygon(4, 2);
// [
//   { x: 2, y: 0 },
//   { x: 0, y: 2 },
//   { x: -2, y: 0 },
//   { x: 0, y: -2 }
// ]
```

