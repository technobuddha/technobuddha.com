<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Encoding](./index.md) / unescapeJava

# Function: unescapeJava()

```ts
function unescapeJava(input: string): string;
```

Defined in: [unescape-java.ts:30](https://github.com/technobuddha/library/blob/main/src/unescape-java.ts#L30)

Unescape a string encoded in Java style

| Escape Sequence    | Hex                  | Character                |
| ------------------ | -------------------- | ------------------------ |
| \\b                | 0x08                 | Backspace                |
| \\f                | 0x0c                 | Form Feed                |
| \\n                | 0x0a                 | New Line                 |
| \\r                | 0x0d                 | Carriage Return          |
| \\t                | 0x09                 | Tab                      |
| \\\\               | 0x5c                 | Backslash                |
| \\'                | 0x27                 | Single Quote             |
| \\"                | 0x22                 | Double Quote             |
| \\unnnn            | 0x0000-0xFFFF    | Unicode Escape           |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The string to unescape |

## Returns

`string`

the string with escapes resolved

## Example

```typescript
unescapeJava('Hello\\nWorld'); // "Hello\nWorld"
unescapeJava('\\u20ac'); // "€"
unescapeJava('\\tTabbed'); // "\tTabbed"
unescapeJava('\\\\'); // "\\"
```

