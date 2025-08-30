<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Unicode](./index.md) / encodeText

# Function: encodeText()

```ts
function encodeText(input: string, _encoding?: TextEncoding): Uint8Array;
```

Defined in: [encode-text.ts:13](https://github.com/technobuddha/library/blob/main/src/encode-text.ts#L13)

Encode a unicode (UTF-16 encoded javascript) string into UTF8

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The string to encode |
| `_encoding?` | [`TextEncoding`](TextEncoding.md) | - |

## Returns

[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

The UTF-8 encoded string

