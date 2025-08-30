<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Encoding](./index.md) / escapeGraphQL

# Function: escapeGraphQL()

```ts
function escapeGraphQL(input: string): string;
```

Defined in: [escape-graph-ql.ts:31](https://github.com/technobuddha/library/blob/main/src/escape-graph-ql.ts#L31)

Escape a string for use in GraphQL

| Character          | Hex                  | Escape Sequence      |
| ------------------ | -------------------- | -------------------- |
| Backspace          | 0x08                 | \\b                  |
| Tab                | 0x09                 | \\t                  |
| Newline            | 0x0a                 | \\n                  |
| Form Feed          | 0x0c                 | \\f                  |
| Carriage Return    | 0x0d                 | \\r                  |
| Double Quote       | 0x22                 | \\"                  |
| Single Quote       | 0x27                 | \\'                  |
| Backslash          | 0x5c                 | \\\\                 |
| Control Characters | 0x00-0x1f, 0x7f-0x9f | \\unnnn              |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The string to escape |

## Returns

`string`

the escaped string

## Example

```typescript
escapeGraphQL('Hello\nWorld'); // "Hello\\nWorld"
escapeGraphQL('"\\');          // "\\\"\\\\"
escapeGraphQL('\b');           // "\\b"
escapeGraphQL('\u20ac');       // "\\u20ac"
```

