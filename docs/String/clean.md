<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / clean

# Function: clean()

```ts
function clean(input: string, characters: 
  | string
  | RegExp
  | (
  | string
  | RegExp)[]): string;
```

Defined in: [clean.ts:14](https://github.com/technobuddha/library/blob/main/src/clean.ts#L14)

Remove all occurrences of characters from the beginning and end of the string

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `input` | `string` | `undefined` | The string |
| `characters` | \| `string` \| [`RegExp`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp) \| ( \| `string` \| [`RegExp`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp))[] | `trimEquivalent` | The characters(s) to remove |

## Returns

`string`

