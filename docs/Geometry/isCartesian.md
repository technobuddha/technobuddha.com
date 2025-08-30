<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / isCartesian

# Function: isCartesian()

```ts
function isCartesian(point: unknown): point is Cartesian;
```

Defined in: [is-cartesian.ts:18](https://github.com/technobuddha/library/blob/main/src/is-cartesian.ts#L18)

Determines if the provided value is a Cartesian point.

A value is considered a Cartesian point if it is a non-null object
that contains numeric `x` and `y` properties.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `point` | `unknown` | The value to test for Cartesian structure. |

## Returns

`point is Cartesian`

`true` if the value is a Cartesian point, otherwise `false`.

## Example

```typescript
isCartesian({ x: 10, y: 20 }); // true
isCartesian({ r: 10, φ: 20 }); // false
```

