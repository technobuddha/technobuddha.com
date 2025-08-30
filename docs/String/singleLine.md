<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / singleLine

# Function: singleLine()

```ts
function singleLine(template: TemplateStringsArray, ...args: unknown[]): string;
```

Defined in: [single-line.ts:13](https://github.com/technobuddha/library/blob/main/src/single-line.ts#L13)

Joins a template literal into a single line string by removing line breaks and leading whitespace,
then interleaving the provided arguments. The result is a trimmed, single-line string.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `template` | `TemplateStringsArray` | The template strings array from a tagged template literal. |
| ...`args` | `unknown`[] | The values to be interpolated into the template. |

## Returns

`string`

A single-line string with all line breaks and leading whitespace removed.

