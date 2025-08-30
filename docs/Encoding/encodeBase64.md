<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Encoding](./index.md) / encodeBase64

# Function: encodeBase64()

Creates a encoded ASCII string from a [BinaryObject](BinaryObject.md) or `string` using
[Base64](https://developer.mozilla.org/en-US/docs/Glossary/Base64).

You can use this method to encode data which may otherwise cause communication problems,
transmit it, then use the [decodeBase64](decodeBase64.md) method to decode the data again. For example, you can
encode control characters.

## Call Signature

```ts
function encodeBase64(chars: string, encoding: TextEncoding): string;
```

Defined in: [encode-base-64.ts:19](https://github.com/technobuddha/library/blob/main/src/encode-base-64.ts#L19)

Convert a string to binary using [encodeText](../Unicode/encodeText.md) with the supplied encoding, and then
encode it to `Base64`.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `chars` | `string` | The string to encode |
| `encoding` | [`TextEncoding`](../Unicode/TextEncoding.md) | The encoding of the input string |

### Returns

`string`

An ASCII string containing the `Base64` representation

### Example

```typescript
encodeBase64('Hello, world!', 'utf8'); // "SGVsbG8sIHdvcmxkIQ=="
```

## Call Signature

```ts
function encodeBase64(binary: BinaryObject): string;
```

Defined in: [src/encode-base-64.ts:29](https://github.com/technobuddha/library/blob/main/src/encode-base-64.ts#L29)

Encode a [BinaryObject](BinaryObject.md) to a `Base64` string.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `binary` | [`BinaryObject`](BinaryObject.md) | The Binary object to encode |

### Returns

`string`

An ASCII string containing the `Base64` representation

### Example

```typescript
encodeBase64(new Uint8Array([1, 2, 3]); // "AQID"
```

