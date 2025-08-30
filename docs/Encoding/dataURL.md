<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Encoding](./index.md) / dataURL

# Function: dataURL()

```ts
function dataURL(input: BinaryObject, mimeType: string): string;
```

Defined in: [data-url.ts:18](https://github.com/technobuddha/library/blob/main/src/data-url.ts#L18)

Convert any binary object into a data URL

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`BinaryObject`](BinaryObject.md) | The binary object |
| `mimeType` | `string` | The MIME type for the URL |

## Returns

`string`

The data URL

## Example

```typescript
const bytes = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
dataURL(bytes, 'text/plain');
// url === "data:text/plain;base64,SGVsbG8="
```

