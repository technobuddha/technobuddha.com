<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Encoding](./index.md) / unescapeC

# Function: unescapeC()

```ts
function unescapeC(input: string): string;
```

Defined in: [unescape-c.ts:42](https://github.com/technobuddha/library/blob/main/src/unescape-c.ts#L42)

Unescape a string encoded in C style

| Escape Sequence    | Hex                  | Character                |
| ------------------ | -------------------- | ------------------------ |
| \\0                | 0x00                 | NUL                      |
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
| \\?                | 0x3f                 | Question Mark            |
| \\nnn[^1]          | 0x0000-0x01ff    | Octal Escape             |
| \\xn…[^2]          |                      | Hex Escape               |
| \\unnnn            | 0x0000-0xFFFF    | Unicode Escape           |
| \\Unnnnnnnn        | 0x0000-0x10FFFF  | Unicode Escape           |

[^1]: An octal escape sequence consists of a backslash followed by one to three octal digits.
The octal escape sequence ends when it either contains three octal digits, or the next character
is not an octal digit.
[^2]: A hex escape sequence must have at least one hex digit following \\x, with no upper bound;
it continues for as many hex digits as there are.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The string to unescape |

## Returns

`string`

the string with escapes resolved

## Example

```typescript
unescapeC('Hello\\nWorld'); // "Hello\nWorld"
unescapeC('\\x48\\x65\\x6c\\x6c\\x6f'); // "Hello"
unescapeC('\\u20ac'); // "€"
unescapeC('\\U0001f600'); // "😀"
```

