<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [English](./index.md) / possessive

# Function: possessive()

```ts
function possessive(input: string): string;
```

Defined in: [possessive.ts:18](https://github.com/technobuddha/library/blob/main/src/possessive.ts#L18)

Determine the possessive form of a word

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The word |

## Returns

`string`

The possessive form of the word

## Example

```typescript
possessive('Calvin');  // "Calvin's"
possessive('Hobbes');  // "Hobbes'"
possessive('BUGS');    // "BUGS'"
possessive('ELMER');   // "ELMER'S"
```

