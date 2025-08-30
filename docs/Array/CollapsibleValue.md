<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Array](./index.md) / CollapsibleValue

# Type Alias: CollapsibleValue\<T\>

```ts
type CollapsibleValue<T> = 
  | T
  | null
  | undefined
| Iterable<T | null | undefined>;
```

Defined in: [collapse.ts:26](https://github.com/technobuddha/library/blob/main/src/collapse.ts#L26)

A `CollapsibleValue<T>`

A `CollapsibleValue<T>` can be:
- A single value of type `T`
- `null`
- `undefined`
- An iterable object returning T | null | undefined

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` *extends* [`CollapsiblePrimitive`](CollapsiblePrimitive.md) | The primitive type that can be collapsed. |

