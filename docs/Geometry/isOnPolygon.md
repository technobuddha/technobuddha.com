<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / isOnPolygon

# Function: isOnPolygon()

```ts
function isOnPolygon(
   point: Cartesian, 
   polygon: Polygon, 
   tolerance: number): boolean;
```

Defined in: [is-on-polygon.ts:18](https://github.com/technobuddha/library/blob/main/src/is-on-polygon.ts#L18)

Determines whether a given point lies exactly on the boundary of a polygon.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `point` | [`Cartesian`](Cartesian.md) | `undefined` | The Cartesian coordinates of the point to test. |
| `polygon` | [`Polygon`](Polygon.md) | `undefined` | The polygon, represented as an array of Cartesian points. |
| `tolerance` | `number` | `1e-10` | Optional tolerance for floating-point comparisons (default is 1e-10). |

## Returns

`boolean`

`true` if the point lies on any edge of the polygon within the given tolerance, otherwise `false`.

