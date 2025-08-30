<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Encoding](./index.md) / unescapeHTML

# Function: unescapeHTML()

```ts
function unescapeHTML(input: string): string;
```

Defined in: [unescape-html.ts:23](https://github.com/technobuddha/library/blob/main/src/unescape-html.ts#L23)

Unescape a string encoded in HTML

| Escape Sequence    | Character                |
| ------------------ | ------------------------ |
| &#n…;              | Numeric character        |
| &#xn…;             | Hexadecimal character    |
| &xc…;              | Named entity

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The string to unescape |

## Returns

`string`

the string with escapes resolved

## Example

```typescript
unescapeHTML('Hello &amp; World'); // "Hello & World"
unescapeHTML('2 &lt; 3 &gt; 1'); // "2 < 3 > 1"
unescapeHTML('&#169; 2025'); // "© 2025"
unescapeHTML('&#x1F600;'); // "😀"
```

