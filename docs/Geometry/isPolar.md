<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / isPolar

# Function: isPolar()

```ts
function isPolar(point: unknown): point is Polar;
```

Defined in: [is-polar.ts:18](https://github.com/technobuddha/library/blob/main/src/is-polar.ts#L18)

Determines if the provided value is a Polar point.

A value is considered a Polar point if it is a non-null object
that contains numeric `φ` and `r` properties.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `point` | `unknown` | The value to test for Polar structure. |

## Returns

`point is Polar`

`true` if the value is a Polar point, otherwise `false`.

## Example

```typescript
isPolar({ r: 10, φ: 20 }); // true
isPolar({ x: 10, y: 20 }); // false
```

