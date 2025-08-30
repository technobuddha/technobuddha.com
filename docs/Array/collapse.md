<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Array](./index.md) / collapse

# Function: collapse()

```ts
function collapse<T>(...args: Collapsible<T>[]): T[];
```

Defined in: [collapse.ts:82](https://github.com/technobuddha/library/blob/main/src/collapse.ts#L82)

Collapses an array of values into a flat array with `null` and `undefined` elements removed.

Each argument can be:
- `T`
- `null`
- `undefined`
- a function returning `T` or `null` or `undefined` or an array
- An iterable returning `T` or `null` or `undefined`

The function flattens all arguments, filters out `null`, and `undefined` values,
and returns the resulting array.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `T` *extends* [`CollapsiblePrimitive`](CollapsiblePrimitive.md) | `string` | The primitive type that can be collapsed. |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`args` | [`Collapsible`](Collapsible.md)\<`T`\>[] | The values to collapse, which may be `T`, generators, iterables, or functions. |

## Returns

`T`[]

An array of `T`, with all `null`, and `undefined` values removed.

## Example

```typescript
collapse(
  "hello",
  ["world", null, "foo"],
  function* () { yield "bar"; yield undefined; yield ["baz"]; },
  () => "qux",
  null,
  undefined
);
// Returns: ["hello", "world", "foo", "bar", "baz", "qux"]
```

