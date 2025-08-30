<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Programming](./index.md) / pascalCase

# Function: pascalCase()

```ts
function pascalCase(input: string): string;
```

Defined in: [pascal-case.ts:20](https://github.com/technobuddha/library/blob/main/src/pascal-case.ts#L20)

Convert an identifier string to pascal case

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The identifier string |

## Returns

`string`

the identifier in pascal case

## Example

```typescript
pascalCase('hello world'); // 'HelloWorld'
pascalCase('Hello world'); // 'HelloWorld'
pascalCase('foo_bar-baz'); // 'FooBarBaz'
pascalCase('FOO BAR'); // 'FooBar'
```

