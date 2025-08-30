<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Programming](./index.md) / dotCase

# Function: dotCase()

```ts
function dotCase(input: string): string;
```

Defined in: [dot-case.ts:18](https://github.com/technobuddha/library/blob/main/src/dot-case.ts#L18)

Convert an identifier string to a dot form

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The identifier string |

## Returns

`string`

the identifier in dot form

## Example

```typescript
dotCase('hello world'); // 'hello.world'
dotCase('HelloWorld'); // 'hello.world'
dotCase('foo_bar-baz'); // 'foo.bar.baz'
dotCase('FOO BAR'); // 'foo.bar'
```

