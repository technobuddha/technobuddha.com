<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / build

# Function: build()

```ts
function build(...args: Collapsible<string>[]): string;
```

Defined in: [build.ts:11](https://github.com/technobuddha/library/blob/main/src/build.ts#L11)

Concatenates strings and/or arrays of strings

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`args` | [`Collapsible`](../Array/Collapsible.md)\<`string`\>[] | Concatenates a list of strings, string arrays, or functions that return a string or string array. |

## Returns

`string`

The concatenation of *args*.

