<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / isPolygon

# Function: isPolygon()

```ts
function isPolygon(object: unknown): object is Polygon;
```

Defined in: [is-polygon.ts:13](https://github.com/technobuddha/library/blob/main/src/is-polygon.ts#L13)

Determines if the provided object is a `Polygon`.

A `Polygon` is defined as an array where every element satisfies the `isCartesian` predicate.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `object` | `unknown` | The value to test for polygon structure. |

## Returns

`object is Polygon`

`true` if the object is a `Polygon`, otherwise `false`.

