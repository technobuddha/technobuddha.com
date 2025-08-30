<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Array](./index.md) / zipperMerge

# Function: zipperMerge()

```ts
function zipperMerge<T>(...arrays: T): { [K in string | number | symbol]: T[K<K>] extends V[] ? V : never }[];
```

Defined in: [zipper-merge.ts:21](https://github.com/technobuddha/library/blob/main/src/zipper-merge.ts#L21)

Merges multiple arrays into a single array by interleaving their elements at each index.

Each element of the resulting array is an array containing the elements from the input arrays at
the corresponding index. If input arrays have different lengths, `undefined` will be used for
missing elements.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `unknown`[][] |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`arrays` | `T` | The arrays to merge |

## Returns

\{ \[K in string \| number \| symbol\]: T\[K\<K\>\] extends V\[\] ? V : never \}[]

An array of arrays, where each inner array contains the elements from the input arrays
at the same index.

## Example

```typescript
zipperMerge([1, 2, 3], ['a', 'b', 'c']);
// Returns: [[1, 'a'], [2, 'b'], [3, 'c']]

zipperMerge([1, 2], ['a', 'b', 'c']);
// Returns: [[1, 'a'], [2, 'b'], [undefined, 'c']]
```

