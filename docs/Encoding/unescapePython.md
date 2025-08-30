<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Encoding](./index.md) / unescapePython

# Function: unescapePython()

```ts
function unescapePython(input: string): string;
```

Defined in: [unescape-python.ts:38](https://github.com/technobuddha/library/blob/main/src/unescape-python.ts#L38)

Unescape a string encoded in Python style

| Escape Sequence    | Hex                  | Character                |
| ------------------ | -------------------- | ------------------------ |
| \\a                | 0x07                 | Bell                     |
| \\b                | 0x08                 | Backspace                |
| \\e                | 0x1b                 | Escape                   |
| \\f                | 0x0c                 | Form Feed                |
| \\n                | 0x0a                 | New Line                 |
| \\r                | 0x0d                 | Carriage Return          |
| \\t                | 0x09                 | Tab                      |
| \\v                | 0x0b                 | Vertical Tab             |
| \\\\               | 0x5c                 | Backslash                |
| \\'                | 0x27                 | Single Quote             |
| \\"                | 0x22                 | Double Quote             |
| \\n…n[^1]          | 0x0000-0x01ff    | Octal Escape             |
| \\xnn              |                      | Hex Escape               |
| \\unnnn            | 0x0000-0xFFFF    | Unicode Escape           |
| \\Unnnnnnnn        | 0x0000-0x10FFFF  | Unicode Escape           |

[^1]: An octal escape sequence consists of a backslash followed by one to three octal digits.
The octal escape sequence ends when it either contains three octal digits, or the next character
is not an octal digit.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The string to unescape |

## Returns

`string`

the string with escapes resolved

## Example

```typescript
unescapePython('Hello\\nWorld'); // "Hello\nWorld"
unescapePython('\\u20ac'); // "€"
unescapePython('\\x48\\x65\\x6c\\x6c\\x6f'); // "Hello"
unescapePython('\\U0001f600'); // "😀"
```

