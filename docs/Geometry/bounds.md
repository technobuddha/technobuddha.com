<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / bounds

# Function: bounds()

```ts
function bounds(vertices: Polygon): Rect;
```

Defined in: [bounds.ts:21](https://github.com/technobuddha/library/blob/main/src/bounds.ts#L21)

Calculates the axis-aligned bounding rectangle for a given polygon.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertices` | [`Polygon`](Polygon.md) | The polygon. |

## Returns

[`Rect`](Rect.md)

A [Rect](Rect.md) representing the smallest rectangle that contains the polygon.

## Throws

`TypeError` If the polygon has fewer than three vertices.

## Example

```typescript
bounds([
  { x: 0, y: 0 },
  { x: 0, y: 5 },
  { x: 10, y: 5 },
  { x: 10, y: 0 },
]);
// { x: 0, y: 0, width: 10, height: 5 }
```

