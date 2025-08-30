<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / FuzzyMatchOptions

# Type Alias: FuzzyMatchOptions

```ts
type FuzzyMatchOptions = {
  caseInsensitive?: boolean;
  weightDiceCoefficient?: number;
  weightLevenshteinDistance?: number;
  weightLongestCommonSubstring?: number;
};
```

Defined in: [fuzzy-match.ts:10](https://github.com/technobuddha/library/blob/main/src/fuzzy-match.ts#L10)

Options for the [fuzzyMatch](fuzzyMatch.md) function

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="caseinsensitive"></a> `caseInsensitive?` | `boolean` | The comparison will ignore case | [src/fuzzy-match.ts:12](https://github.com/technobuddha/library/blob/main/src/fuzzy-match.ts#L12) |
| <a id="weightdicecoefficient"></a> `weightDiceCoefficient?` | `number` | Weight of diceCoefficient | [src/fuzzy-match.ts:16](https://github.com/technobuddha/library/blob/main/src/fuzzy-match.ts#L16) |
| <a id="weightlevenshteindistance"></a> `weightLevenshteinDistance?` | `number` | Weight of levenshtein distance | [src/fuzzy-match.ts:14](https://github.com/technobuddha/library/blob/main/src/fuzzy-match.ts#L14) |
| <a id="weightlongestcommonsubstring"></a> `weightLongestCommonSubstring?` | `number` | Weight of longestCommonSubstring | [src/fuzzy-match.ts:18](https://github.com/technobuddha/library/blob/main/src/fuzzy-match.ts#L18) |

