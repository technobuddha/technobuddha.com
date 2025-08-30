<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Programming](./index.md) / humanCase

# Function: humanCase()

```ts
function humanCase(input: string): string;
```

Defined in: [human-case.ts:19](https://github.com/technobuddha/library/blob/main/src/human-case.ts#L19)

Convert an identifier string to a human case

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The identifier string |

## Returns

`string`

string in human case

## Example

```typescript
humanCase('helloWorld'); // 'hello world'
humanCase('HelloWorld'); // 'hello world'
humanCase('foo_bar-baz'); // 'foo bar baz'
humanCase('FOO BAR'); // 'foo bar'
```

