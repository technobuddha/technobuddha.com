<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / getIndent

# Function: getIndent()

```ts
function getIndent(input: string, options: IndentOptions): number;
```

Defined in: [get-indent.ts:13](https://github.com/technobuddha/library/blob/main/src/get-indent.ts#L13)

Determine the indentation level of text

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The indented text |
| `options` | [`IndentOptions`](IndentOptions.md) | see [IndentOptions](IndentOptions.md) |

## Returns

`number`

The minimum amount of indentation on each line

## Default Value

```ts
indenter space
```

