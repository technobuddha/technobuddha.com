<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Unicode](./index.md) / decodeText

# Function: decodeText()

```ts
function decodeText(input: 
  | TypedArray
  | ArrayLike<number>
  | ArrayBuffer, _encoding: TextEncoding): string;
```

Defined in: [decode-text.ts:15](https://github.com/technobuddha/library/blob/main/src/decode-text.ts#L15)

Decode a UTF8 encoded string into unicode

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `input` | \| [`TypedArray`](../Utility/TypedArray.md) \| `ArrayLike`\<`number`\> \| [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | `undefined` | the utf encoded string |
| `_encoding` | [`TextEncoding`](TextEncoding.md) | `'utf8'` | - |

## Returns

`string`

the decoded strings (which is encoded as UTF-16 by javascript)

