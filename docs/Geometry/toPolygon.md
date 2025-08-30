<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / toPolygon

# Function: toPolygon()

Converts two [Cartesian](Cartesian.md) points or a [Rect](Rect.md) into a [Polygon](Polygon.md).

## Call Signature

```ts
function toPolygon(pointA: Cartesian, pointB: Cartesian): Polygon;
```

Defined in: [to-polygon.ts:23](https://github.com/technobuddha/library/blob/main/src/to-polygon.ts#L23)

Converts two [Cartesian](Cartesian.md) points into a [Polygon](Polygon.md).

Construct a rectangle defined by two points as opposite corners.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pointA` | [`Cartesian`](Cartesian.md) | The first corner point of the rectangle. |
| `pointB` | [`Cartesian`](Cartesian.md) | The opposite corner point of the rectangle. |

### Returns

[`Polygon`](Polygon.md)

A rectangle shaped [Polygon](Polygon.md).

### Example

```typescript
toPolygon({ x: 1, y: 2 }, { x: 4, y: 6 });
// [
//   { x: 1, y: 2 },
//   { x: 4, y: 2 },
//   { x: 4, y: 6 },
//   { x: 1, y: 6 }
// ]
```

## Call Signature

```ts
function toPolygon(rect: Rect): Polygon;
```

Defined in: [src/to-polygon.ts:43](https://github.com/technobuddha/library/blob/main/src/to-polygon.ts#L43)

Convert a [Rect](Rect.md) into a [Polygon](Polygon.md).

Construct a rectangle defined by location and dimensions.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rect` | [`Rect`](Rect.md) | The [Rect](Rect.md) to convert. |

### Returns

[`Polygon`](Polygon.md)

A rectangle shaped [Polygon](Polygon.md).

### Example

```typescript
toPolygon({ x: 1, y: 2, width: 3, height: 4 });
// [
//   { x: 1, y: 2 },
//   { x: 4, y: 2 },
//   { x: 4, y: 6 },
//   { x: 1, y: 6 }
// ]
```

