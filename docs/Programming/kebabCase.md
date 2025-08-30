<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Programming](./index.md) / kebabCase

# Function: kebabCase()

```ts
function kebabCase(input: string): string;
```

Defined in: [kebab-case.ts:18](https://github.com/technobuddha/library/blob/main/src/kebab-case.ts#L18)

Convert an identifier string to a kebab-case form

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The identifier string |

## Returns

`string`

the identifier in kebab-case form

## Example

```typescript
kebabCase('hello world'); // 'hello-world'
kebabCase('HelloWorld'); // 'hello-world'
kebabCase('foo_bar-baz'); // 'foo-bar-baz'
kebabCase('FOO BAR'); // 'foo-bar'
```

