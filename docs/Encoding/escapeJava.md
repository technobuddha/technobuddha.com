<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Encoding](./index.md) / escapeJava

# Function: escapeJava()

```ts
function escapeJava(input: string): string;
```

Defined in: [escape-java.ts:37](https://github.com/technobuddha/library/blob/main/src/escape-java.ts#L37)

Escape a string for use in Java

| Character          | Hex                  | Escape Sequence      |
| ------------------ | -------------------- | -------------------- |
| NUL                | 0x00                 | \\u0000              |
| Backspace          | 0x08                 | \\b                  |
| Tab                | 0x09                 | \\t                  |
| Newline            | 0x0a                 | \\n                  |
| Form Feed          | 0x0c                 | \\f                  |
| Carriage Return    | 0x0d                 | \\r                  |
| Double Quote       | 0x22                 | \\"                  |
| Single Quote       | 0x27                 | \\'                  |
| Backslash          | 0x5c                 | \\\\                 |
| Control Characters | 0x00-0x1f, 0x7f-0x9f | \\unnnn              |
| BMP                | 0x0100-0xffff    | \\unnnn              |
| Astral             | 0x10000-0x10ffff   | \\unnnn\\unnnn[^1]   |

[^1]: Java does not support unicode escapes beyond 0xFFFF.  Astral characters must be
encoded as a two character surrogate pair.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The string to escape |

## Returns

`string`

The string escaped for Java

## Example

```typescript
escapeJava('Hello\nWorld'); // "Hello\\nWorld"
escapeJava('"\\');          // "\\\"\\\\"
escapeJava('\b');           // "\\b"
escapeJava('\u20ac');       // "\\u20ac"
```

