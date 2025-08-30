<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / toSquare

# Function: toSquare()

```ts
function toSquare(rect: Rect): Rect;
```

Defined in: [to-square.ts:23](https://github.com/technobuddha/library/blob/main/src/to-square.ts#L23)

Converts a [Rect](Rect.md) to the largest possible square that fits within it,
centered along the longer dimension. If the rectangle is already a square,
it returns the original rectangle.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rect` | [`Rect`](Rect.md) | The [Rect](Rect.md). |

## Returns

[`Rect`](Rect.md)

A square shaped [Rect](Rect.md).

## Example

```typescript
toSquare({ x: 1, y: 2, width: 6, height: 4 });
// { x: 2, y: 2, width: 4, height: 4 }

toSquare({ x: 1, y: 2, width: 3, height: 7 });
// { x: 1, y: 4, width: 3, height: 3 }

toSquare({ x: 0, y: 0, width: 5, height: 5 });
// { x: 0, y: 0, width: 5, height: 5 }
```

