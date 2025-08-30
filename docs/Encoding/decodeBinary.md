<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Encoding](./index.md) / decodeBinary

# Function: decodeBinary()

```ts
function decodeBinary(input: string, encoding: BinaryEncoding): Uint8Array;
```

Defined in: [decode-binary.ts:28](https://github.com/technobuddha/library/blob/main/src/decode-binary.ts#L28)

Decode a string into a binary object

The string can be in `base64`, `base64url`, `hex`, or `binary` [BinaryEncoding](BinaryEncoding.md) format.

- `base64`: The binary object was encoded using [encodeBase64](encodeBase64.md)
- `base64url`: The binary object was encoded using [encodeBase64Url](encodeBase64Url.md)
- `hex`: each byte in the binary object was converted to a 2-digit hexadecimal number.
- `binary`: each byte in the binary object was converted to a single 8-bit character.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | encoded binary object |
| `encoding` | [`BinaryEncoding`](BinaryEncoding.md) | The encoding to use |

## Returns

[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

encoded string

## Example

```typescript
decodeBinary('SGVsbG8=', 'base64');      // Uint8Array([72, 101, 108, 108, 111])
decodeBinary('SGVsbG8', 'base64url');    // Uint8Array([72, 101, 108, 108, 111])
decodeBinary('48656c6c6f', 'hex');       // Uint8Array([72, 101, 108, 108, 111])
decodeBinary('Hello', 'binary');         // Uint8Array([72, 101, 108, 108, 111])
```

