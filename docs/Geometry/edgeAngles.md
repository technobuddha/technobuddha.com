<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / edgeAngles

# Function: edgeAngles()

```ts
function edgeAngles(polygon: Polygon, normalizeTo: number): Generator<number>;
```

Defined in: [edge-angles.ts:30](https://github.com/technobuddha/library/blob/main/src/edge-angles.ts#L30)

Generate normalized edge angles from polygon edges.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `polygon` | [`Polygon`](Polygon.md) | The polygon to extract edge angles from |
| `normalizeTo` | `number` | Angle to normalize to (e.g., Math.PI * 2 for full rotation, Math.PI / 2 for quadrant) |

## Returns

[`Generator`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Generator)\<`number`\>

Generator that yields edge angles, normalized to the specified range

## Example

```typescript
const polygon: Polygon = [
  { x: 0, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 2 },
  { x: -1, y: 1 }
];
const angles = edgeAngles(polygon);
for (const angle of angles) {
  console.log(angle);
}
// Output:
// 0.7853981633974483
// 2.356194490192345
// 3.9269908169872414
// 5.497787143782138
```

