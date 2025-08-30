<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / manhattanDistance

# Function: manhattanDistance()

```ts
function manhattanDistance(a: Cartesian, b: Cartesian): number;
```

Defined in: [manhattan-distance.ts:21](https://github.com/technobuddha/library/blob/main/src/manhattan-distance.ts#L21)

Calculates the Manhattan Distance between two points in Cartesian coordinates.

The Manhattan Distance is based on the number of blocks that one would have
to walk in Manhattan to get from one point to another.   It is assumed that
"Manhattan" is an orthogonal grid where no diagonal movement is allowed.

Manhattan distance is often used in grid-based path-finding algorithms.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `a` | [`Cartesian`](Cartesian.md) | The first point. |
| `b` | [`Cartesian`](Cartesian.md) | The second point. |

## Returns

`number`

The Manhattan distance between the two points.

## Example

```typescript
manhattanDistance({ x: 1, y: 2 }, { x: 4, y: 6 }); // 7
```

