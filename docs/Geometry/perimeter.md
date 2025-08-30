<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / perimeter

# Function: perimeter()

```ts
function perimeter(polygon: Polygon): number;
```

Defined in: [perimeter.ts:23](https://github.com/technobuddha/library/blob/main/src/perimeter.ts#L23)

Calculates the perimeter of a polygon.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `polygon` | [`Polygon`](Polygon.md) | The polygon. |

## Returns

`number`

The total perimeter length of the polygon.

## Example

```typescript
const polygon: Polygon = [
  { x: 0, y: 0 },
  { x: 10, y: 0 },
  { x: 10, y: 10 },
  { x: 0, y: 10 }
];
const result = perimeter(polygon);
// result: 40
```

