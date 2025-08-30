<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Encoding](./index.md) / encodeBinary

# Function: encodeBinary()

```ts
function encodeBinary(input: Uint8Array, encoding: BinaryEncoding): string;
```

Defined in: [encode-binary.ts:30](https://github.com/technobuddha/library/blob/main/src/encode-binary.ts#L30)

Encode an [BinaryObject](BinaryObject.md) into a string

The string can be in `base64`, `base64url`, `hex`, or `binary` format.

- `base64`: The binary object is encoded using [encodeBase64](encodeBase64.md)
- `base64url`: The binary object is encoded using [encodeBase64Url](encodeBase64Url.md)
- `hex`: each byte in the binary object is converted to a 2-digit hexadecimal number.
- `binary`: each byte in the binary object is converted to a 8-bit character.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | binary object |
| `encoding` | [`BinaryEncoding`](BinaryEncoding.md) | The encoding to use |

## Returns

`string`

Encoded string

## Example

```typescript
encodeBinary(Uint8Array([72, 101, 108, 108, 111]), 'base64');    // 'SGVsbG8='
encodeBinary(Uint8Array([72, 101, 108, 108, 111]), 'base64url'); // 'SGVsbG8'
encodeBinary(Uint8Array([72, 101, 108, 108, 111]), 'hex');       // '48656c6c6f'
encodeBinary(Uint8Array([72, 101, 108, 108, 111]), 'binary');    // 'Hello'
```

## Remarks

A string encoded in `binary` format may not be "well-formed"

## See

[isWellFormed](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/isWellFormed)

