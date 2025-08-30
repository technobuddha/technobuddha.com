<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / rotate

# Function: rotate()

Rotates a point or a polygon around a given origin by a specified angle.

## Call Signature

```ts
function rotate(
   point: Cartesian, 
   angle: number, 
   options?: UnitOptions & OriginOptions): Cartesian;
```

Defined in: [rotate.ts:31](https://github.com/technobuddha/library/blob/main/src/rotate.ts#L31)

Rotates a point around a given origin by a specified angle.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `point` | [`Cartesian`](Cartesian.md) | The point or array of points to rotate. |
| `angle` | `number` | The angle to rotate the point(s) by. Positive values rotate counterclockwise. |
| `options?` | [`UnitOptions`](UnitOptions.md) & [`OriginOptions`](OriginOptions.md) | see [UnitOptions](UnitOptions.md) & [OriginOptions](OriginOptions.md) |

### Returns

[`Cartesian`](Cartesian.md)

The rotated point.

### Example

```typescript
rotate({ x: 1, y: 0 }, Math.PI / 2); // { x: 0, y: 1 }
```

## Call Signature

```ts
function rotate(
   polygon: Polygon, 
   angle: number, 
   options?: UnitOptions & OriginOptions): Polygon;
```

Defined in: [src/rotate.ts:52](https://github.com/technobuddha/library/blob/main/src/rotate.ts#L52)

Rotates a polygon around a given origin by a specified angle.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `polygon` | [`Polygon`](Polygon.md) | The polygon to rotate. |
| `angle` | `number` | The angle to rotate the point(s) by. Positive values rotate counterclockwise. |
| `options?` | [`UnitOptions`](UnitOptions.md) & [`OriginOptions`](OriginOptions.md) | see [UnitOptions](UnitOptions.md) & [OriginOptions](OriginOptions.md) |

### Returns

[`Polygon`](Polygon.md)

The rotated polygon.

### Example

```typescript
rotate(
  [{ x: 1, y: 0 }, { x: 0, y: 1 }],
  Math.PI / 2,
  { x: 0, y: 0 }
);
// [{ x: 0, y: 1 }, { x: -1, y: 0 }]
```

