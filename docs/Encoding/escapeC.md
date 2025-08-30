<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Encoding](./index.md) / escapeC

# Function: escapeC()

```ts
function escapeC(input: string): string;
```

Defined in: [escape-c.ts:46](https://github.com/technobuddha/library/blob/main/src/escape-c.ts#L46)

Escape a string for use in C/C++

| Character          | Hex                  | Escape Sequence          |
| ------------------ | -------------------- | ------------------------ |
| NUL                | 0x00                 | \\0 or \\000[^1]         |
| Bell               | 0x07                 | \\a                      |
| Backspace          | 0x08                 | \\b                      |
| Tab                | 0x09                 | \\t                      |
| Newline            | 0x0a                 | \\n                      |
| Vertical Tab       | 0x0b                 | \\v                      |
| Form Feed          | 0x0c                 | \\f                      |
| Carriage Return    | 0x0d                 | \\r                      |
| Escape             | 0x1b                 | \\x1b[^2] or \\u001b[^3] |
| Double Quote       | 0x22                 | \\"                      |
| Single Quote       | 0x27                 | \\'                      |
| Question Mark      | 0x3f                 | \\?                      |
| Backslash          | 0x5c                 | \\\\                     |
| Control Characters | 0x00-0x1f, 0x7f-0x9f | \\xnn or \\unnnn[^3]     |
| BMP                | 0x0100-0xffff    | \\unnnn                  |
| Astral             | 0x10000-0x10ffff   | \\Unnnnnnnn              |

[^1]: The sequence \\0 must not be followed by a octal digit (0-7) to avoid being interpreted
as a different character, \\000 will be used to avoid ambiguity.
[^2]: The non-standard sequence \\e represents the escape character in GCC, clang and tcc.
It was not added to the C standard because it has no meaningful equivalent in some character sets
(such as EBCDIC).
[^3]: The sequence \\xnn must not be followed by a hexadecimal digit (0-9, a-f, A-F) to avoid
being interpreted as a different character, \\unnnn will be used to avoid ambiguity.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The string to escape |

## Returns

`string`

the escaped string

## Example

```typescript
escapeC('Hello\nWorld'); // "Hello\\nWorld"
escapeC('"\\');          // "\\\"\\\\"
escapeC('\x07');         // "\\a"
escapeC('\u20ac');       // "\\u20ac"
```

