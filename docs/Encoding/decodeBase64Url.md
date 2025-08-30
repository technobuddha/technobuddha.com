<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Encoding](./index.md) / decodeBase64Url

# Function: decodeBase64Url()

Decodes a string of data which has been encoded using
[Base64Url](https://developer.mozilla.org/en-US/docs/Glossary/Base64) encoding.

You can use the [encodeBase64Url](encodeBase64Url.md) method to encode and transmit data which may otherwise cause
communication problems, then transmit it and use the `decodeBase64Url` method to decode the data again.
For example, you can encode, transmit, and decode control characters.

## Remarks

Whitespace within the Base64 encoded string is ignored.

## Throws

`TypeError` If the input string is not correctly encoded.

## Call Signature

```ts
function decodeBase64Url(input: string): Uint8Array;
```

Defined in: [decode-base-64-url.ts:16](https://github.com/technobuddha/library/blob/main/src/decode-base-64-url.ts#L16)

Decode a [Base64Url](https://developer.mozilla.org/en-US/docs/Glossary/Base64) encoded string and
output in binary format.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | A string containing the Base64 encoded data to decode. |

### Returns

[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

An `Uint8Array` containing the decoded data.

### Example

```typescript
decodeBase64('SGVsbG8sIHdvcmxkIQ==');
// Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33])
```

## Call Signature

```ts
function decodeBase64Url(input: string, encoding: TextEncoding): string;
```

Defined in: [src/decode-base-64-url.ts:29](https://github.com/technobuddha/library/blob/main/src/decode-base-64-url.ts#L29)

Decode a [Base64Url](https://developer.mozilla.org/en-US/docs/Glossary/Base64) encoded string as a
string with the specified text encoding.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | A string containing the Base6Url encoded data to decode. |
| `encoding` | [`TextEncoding`](../Unicode/TextEncoding.md) | The text encoding to use for the decoded string. |

### Returns

`string`

An `string` containing the decoded data.

### Example

```typescript
decodeBase64('SGVsbG8sIHdvcmxkIQ==', 'utf-8');
// "Hello, world!"
```

