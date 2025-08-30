<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Encoding](./index.md) / unescapeJS

# Function: unescapeJS()

```ts
function unescapeJS(input: string): string;
```

Defined in: [unescape-js.ts:32](https://github.com/technobuddha/library/blob/main/src/unescape-js.ts#L32)

Unescape a string encoded in Javascript style

| Escape Sequence      | Character          | Hex                  |
| -------------------- | ------------------ | -------------------- |
| \\b                  | Backspace          | 0x08                 |
| \\t                  | Tab                | 0x09                 |
| \\n                  | Newline            | 0x0a                 |
| \\v                  | Vertical Tab       | 0x0b                 |
| \\f                  | Form Feed          | 0x0c                 |
| \\r                  | Carriage Return    | 0x0d                 |
| \\"                  | Double Quote       | 0x22                 |
| \\'                  | Single Quote       | 0x27                 |
| \\\\                 | Backslash          | 0x5c                 |
| \\n…n[^1]            | Octal Escape       | 0x0000-0x01ff    |
| \\xnn                | Hexadecimal Escape | 0x0000-0x00ff    |
| \\unnnn              | Unicode Escape     | 0x00000-0x00ffff   |
| \\u{code-point}    | Code Point Escape  | 0x00000-0x10ffff   |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | the string to unescape |

## Returns

`string`

the string with escapes resolved

## Example

```typescript
unescapeJS('Hello\\nWorld'); // "Hello\nWorld"
unescapeJS('\\u20ac'); // "€"
unescapeJS('\\x48\\x65\\x6c\\x6c\\x6f'); // "Hello"
unescapeJS('\\u{1F600}'); // "😀"
```

