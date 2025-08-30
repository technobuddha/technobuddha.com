<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / translate

# Function: translate()

Translate a point or polygon by a specified amount.

## Call Signature

```ts
function translate(point: Cartesian, amount: XY): Cartesian;
```

Defined in: [translate.ts:24](https://github.com/technobuddha/library/blob/main/src/translate.ts#L24)

Translate a point by a specified amount.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `point` | [`Cartesian`](Cartesian.md) | The point or array of points to translate. |
| `amount` | [`XY`](XY.md) | The amount to move the point by. |

### Returns

[`Cartesian`](Cartesian.md)

The translated point.

### Example

```typescript
translate({ x: 1, y: 0 }t, { x: 1, y: 2 }); // { x: 2, y: 2 }
```

## Call Signature

```ts
function translate(polygon: Polygon, amount: Cartesian): Polygon;
```

Defined in: [src/translate.ts:39](https://github.com/technobuddha/library/blob/main/src/translate.ts#L39)

Translate a polygon by a specified amount.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `polygon` | [`Polygon`](Polygon.md) | The polygon to translate. |
| `amount` | [`Cartesian`](Cartesian.md) | The amount to move the polygon by. |

### Returns

[`Polygon`](Polygon.md)

The translated polygon.

### Example

```typescript
translate([{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1}], { x: 1, y: 2 });
// [{ x: 1, y: 2 }, { x: 2, y: 3 }, { x: 1, y: 3 }]
```

