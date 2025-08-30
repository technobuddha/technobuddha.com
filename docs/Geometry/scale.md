<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / scale

# Function: scale()

Scales a point or a polygon of points around a given origin by a specified amount.

## Call Signature

```ts
function scale(
   point: Cartesian, 
   amount: number | XY, 
   options?: OriginOptions): Cartesian;
```

Defined in: [scale.ts:34](https://github.com/technobuddha/library/blob/main/src/scale.ts#L34)

Scales a point around a given origin by a specified amount.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `point` | [`Cartesian`](Cartesian.md) | The point to rotate. |
| `amount` | `number` \| [`XY`](XY.md) | The amount to scale the point(s) by. This can be a number (uniform scaling) or a Cartesian object (non-uniform scaling). |
| `options?` | [`OriginOptions`](OriginOptions.md) | see [OriginOptions](OriginOptions.md) |

### Returns

[`Cartesian`](Cartesian.md)

The rotated point.

### Example

```typescript
scale({ x: 1, y: 0 }, 2); // { x: 2, y: 0 }
```

## Call Signature

```ts
function scale(
   polygon: Polygon, 
   amount: number | XY, 
   options?: OriginOptions): Cartesian[];
```

Defined in: [src/scale.ts:47](https://github.com/technobuddha/library/blob/main/src/scale.ts#L47)

Scales a polygon around a given origin by a specified amount.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `polygon` | [`Polygon`](Polygon.md) | The polygon to rotate |
| `amount` | `number` \| [`XY`](XY.md) | The amount to scale the point(s) by. This can be a number (uniform scaling) or a Cartesian object (non-uniform scaling). |
| `options?` | [`OriginOptions`](OriginOptions.md) | see [OriginOptions](OriginOptions.md) |

### Returns

[`Cartesian`](Cartesian.md)[]

The rotated polygon

### Example

```typescript
scale([{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 2}], 2);
// [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 2, y: 4 }]
```

