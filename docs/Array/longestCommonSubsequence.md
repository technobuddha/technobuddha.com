<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Array](./index.md) / longestCommonSubsequence

# Function: longestCommonSubsequence()

```ts
function longestCommonSubsequence<T>(
   array1: ArrayLike<T>, 
   array2: ArrayLike<T>, 
   options: LongestCommonSubsequenceOptions<T>): T[];
```

Defined in: [longest-common-subsequence.ts:46](https://github.com/technobuddha/library/blob/main/src/longest-common-subsequence.ts#L46)

Determine the longest possible array that is subsequence of both of given arrays.

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | Type of objects in the arrays. |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `array1` | `ArrayLike`\<`T`\> | First array of objects. |
| `array2` | `ArrayLike`\<`T`\> | Second array of objects. |
| `options` | [`LongestCommonSubsequenceOptions`](LongestCommonSubsequenceOptions.md)\<`T`\> | Functions to compare and collect elements from the two arrays |

## Returns

`T`[]

A list of objects that are common to both arrays
such that there is no common subsequence with size greater than the
length of the list.

## Remarks

Implementation of [Longest Common Subsequence](https://en.wikipedia.org/wiki/Longest_common_subsequence) algorithm.

## Example

```typescript
longestCommonSubsequence(
 ['a', 'b', 'c', ' ', 'd', 'e', 'f'],
 ['a', 'c', ' ', 'd', 'e', 'c'],
); // ['a', 'c', ' ', 'd', 'e']
```

