<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Encoding](./index.md) / escapeJS

# Function: escapeJS()

```ts
function escapeJS(input: string): string;
```

Defined in: [escape-js.ts:38](https://github.com/technobuddha/library/blob/main/src/escape-js.ts#L38)

Escape a string for use in Javascript

| Character          | Hex                  | Escape Sequence      |
| ------------------ | -------------------- | -------------------- |
| NUL                | 0x00                 | \\0 or \\x00[^1]     |
| Backspace          | 0x08                 | \\b                  |
| Tab                | 0x09                 | \\t                  |
| Newline            | 0x0a                 | \\n                  |
| Vertical Tab       | 0x0b                 | \\v                  |
| Form Feed          | 0x0c                 | \\f                  |
| Carriage Return    | 0x0d                 | \\r                  |
| Double Quote       | 0x22                 | \\"                  |
| Single Quote       | 0x27                 | \\'                  |
| Backslash          | 0x5c                 | \\\\                 |
| Control Characters | 0x00-0x1f, 0x7f-0x9f | \\xnn                |
| BMP                | 0x0100-0xffff    | \\unnnn              |
| Astral             | 0x10000-0x10ffff   | \\u{nnn...}        |

[^1]: The sequence \\0 must not be followed by a octal digit (0-7) to avoid being interpreted
as a different character, \\x00 will be used to avoid ambiguity.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The string to escape |

## Returns

`string`

Sting escaped for Javascript

## Example

```typescript
escapeJS('Hello\nWorld'); // "Hello\\nWorld"
escapeJS('"\\');          // "\\\"\\\\"
escapeJS('\b');           // "\\b"
escapeJS('\u20ac');       // "\\u20ac"
```

