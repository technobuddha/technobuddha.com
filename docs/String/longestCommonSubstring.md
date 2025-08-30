<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / longestCommonSubstring

# Function: longestCommonSubstring()

```ts
function longestCommonSubstring(
   string1: string, 
   string2: string, 
   __namedParameters: LongestCommonSubstringOptions): string;
```

Defined in: [longest-common-substring.ts:24](https://github.com/technobuddha/library/blob/main/src/longest-common-substring.ts#L24)

Implementation of [Longest Common Substring](https://en.wikipedia.org/wiki/Longest_common_substring_problem) algorithm.

Returns the longest possible substring that is substring of both of given strings.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `string1` | `string` | First string. |
| `string2` | `string` | Second string. |
| `__namedParameters` | [`LongestCommonSubstringOptions`](LongestCommonSubstringOptions.md) | - |

## Returns

`string`

A string that is common to both strings such that there is no
common substring with size greater than the length of the string.

