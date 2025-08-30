<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [English](./index.md) / splitSentences

# Function: splitSentences()

```ts
function splitSentences(input: string): string[];
```

Defined in: [split-sentences.ts:45](https://github.com/technobuddha/library/blob/main/src/split-sentences.ts#L45)

Splits the input string into an array of sentences.

End of sentences are found by looking for the following characters followed by
an optional closing quotation mark and terminated by white space or a end of line:

| Character | Description                |
| --------- | -------------------------- |
| ?         | Question mark              |
| :         | Colon                      |
| [         | Opening square bracket     |
| .         | Period                     |
| !         | Exclamation mark           |
| ?         | Question mark              |
| ‼         | Double exclamation mark    |
| ‽         | Interrobang                |
| ⁇         | Double question mark       |
| ⁈         | Question exclamation mark  |
| ⁉         | Exclamation question mark  |
| :         | Colon                      |
| …         | Ellipsis                   |
| ...       | Triple period              |

| Character | Description                |
| --------- | -------------------------- |
| "         | Double quotation mark      |
| '         | Single quotation mark      |
| ”         | Right double quotation mark|
| ’         | Right single quotation mark|

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The string to be split into sentences. |

## Returns

`string`[]

An array of non-empty, trimmed sentences.

## Example

```ts
splitSentences("Hello! How are you? I'm 'OK.'"); // ["Hello!", "How are you?", "I'm 'OK.'"]
```

