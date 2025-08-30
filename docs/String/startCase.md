<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / startCase

# Function: startCase()

```ts
function startCase(input: string): string;
```

Defined in: [start-case.ts:13](https://github.com/technobuddha/library/blob/main/src/start-case.ts#L13)

Converts a given string to start case, capitalizing the first letter of each word and converting the rest to lowercase.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The input string to be converted. |

## Returns

`string`

The start-cased version of the input string.

## Example

```typescript
startCase('hello world'); // "Hello World"
startCase('fooBar');      // "Foobar"
```

