<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / isRect

# Function: isRect()

```ts
function isRect(object: unknown): object is Rect;
```

Defined in: [is-rect.ts:20](https://github.com/technobuddha/library/blob/main/src/is-rect.ts#L20)

Determines if the provided value is a [Rect](Rect.md)e.

A value is considered a [Rect](Rect.md) if it is a non-null object
that contains numeric `x`, `y`, 'width', and 'height' properties.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `object` | `unknown` | The value to test for Rectangle structure. |

## Returns

`object is Rect`

`true` if the value is a Rectangle, otherwise `false`.

## Example

```typescript
isRect({ x: 1, y: 2, width: 3, height: 4 }); // true
isRect({ x: 1, y: 2, width: 3 }); // false
isRect(null); // false
isRect([1, 2, 3, 4]); // false
```

