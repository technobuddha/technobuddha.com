<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Programming](./index.md) / camelCase

# Function: camelCase()

```ts
function camelCase(input: string): string;
```

Defined in: [camel-case.ts:20](https://github.com/technobuddha/library/blob/main/src/camel-case.ts#L20)

Convert an identifier string to a camel case

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The identifier string |

## Returns

`string`

string in camel case

## Example

```typescript
camelCase('hello world'); // 'helloWorld'
camelCase('Hello World'); // 'helloWorld'
camelCase('foo_bar-baz'); // 'fooBarBaz'
camelCase('FOO BAR'); // 'fooBar'
```

