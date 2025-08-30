<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / sortOrder

# Function: sortOrder()

```ts
function sortOrder(text: string, options: SortOrderOptions): string;
```

Defined in: [sort-order.ts:24](https://github.com/technobuddha/library/blob/main/src/sort-order.ts#L24)

Convert a string into a sortable string

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `text` | `string` | string to convert |
| `options` | [`SortOrderOptions`](SortOrderOptions.md) | see [SortOrderOptions](SortOrderOptions.md) |

## Returns

`string`

sortable string

## Remarks

for example "The Beatles" becomes "Beatles, The"

