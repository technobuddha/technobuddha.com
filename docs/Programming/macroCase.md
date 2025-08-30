<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Programming](./index.md) / macroCase

# Function: macroCase()

```ts
function macroCase(input: string): string;
```

Defined in: [macro-case.ts:18](https://github.com/technobuddha/library/blob/main/src/macro-case.ts#L18)

Convert an identifier string to macro case

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The identifier string |

## Returns

`string`

the identifier in macro case

## Example

```typescript
macroCase('hello world'); // 'HELLO_WORLD'
macroCase('HelloWorld'); // 'HELLO_WORLD'
macroCase('foo_bar-baz'); // 'FOO_BAR_BAZ'
macroCase('FOO BAR'); // 'FOO_BAR'
```

