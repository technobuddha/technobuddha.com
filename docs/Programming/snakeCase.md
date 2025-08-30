<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Programming](./index.md) / snakeCase

# Function: snakeCase()

```ts
function snakeCase(input: string): string;
```

Defined in: [snake-case.ts:18](https://github.com/technobuddha/library/blob/main/src/snake-case.ts#L18)

Convert an identifier string to snake case

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The identifier string |

## Returns

`string`

the identifier in snake case

## Example

```typescript
snakeCase('hello world'); // 'hello_world'
snakeCase('HelloWorld'); // 'hello_world'
snakeCase('foo_bar-baz'); // 'foo_bar_baz'
snakeCase('FOO BAR'); // 'foo_bar'
```

