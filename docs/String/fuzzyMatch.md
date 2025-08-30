<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / fuzzyMatch

# Function: fuzzyMatch()

```ts
function fuzzyMatch(
   input: string, 
   comparedTo: string, 
   options: FuzzyMatchOptions): number;
```

Defined in: [fuzzy-match.ts:31](https://github.com/technobuddha/library/blob/main/src/fuzzy-match.ts#L31)

Computes a fuzzy similarity score between two strings using a weighted combination
of Levenshtein distance, Dice coefficient, and longest common substring metrics.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The input string to compare. |
| `comparedTo` | `string` | The string to compare against. |
| `options` | [`FuzzyMatchOptions`](FuzzyMatchOptions.md) | Optional configuration for the comparison. |

## Returns

`number`

A similarity score between 0 and 1, where 1 indicates a perfect match.

