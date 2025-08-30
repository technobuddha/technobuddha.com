<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Array](./index.md) / LongestCommonSubsequenceOptions

# Type Alias: LongestCommonSubsequenceOptions\<T\>

```ts
type LongestCommonSubsequenceOptions<T> = {
  collect?: (this: void, i1: number, i2: number) => T;
  compare?: (this: void, a: T, b: T) => boolean;
};
```

Defined in: [longest-common-subsequence.ts:9](https://github.com/technobuddha/library/blob/main/src/longest-common-subsequence.ts#L9)

Options for configuring the [longestCommonSubsequence](longestCommonSubsequence.md) calculation.

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | Type of objects in the arrays. |

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="collect"></a> `collect?` | (`this`: `void`, `i1`: `number`, `i2`: `number`) => `T` | Function used to decide what to return as a result subsequence. It accepts 2 arguments: index of common element in the first array and index in the second. The default function returns element from the first array. | [src/longest-common-subsequence.ts:22](https://github.com/technobuddha/library/blob/main/src/longest-common-subsequence.ts#L22) |
| <a id="compare"></a> `compare?` | (`this`: `void`, `a`: `T`, `b`: `T`) => `boolean` | Function that acts as a custom comparator for the array objects. Function should return true if objects are equal, otherwise false. | [src/longest-common-subsequence.ts:14](https://github.com/technobuddha/library/blob/main/src/longest-common-subsequence.ts#L14) |

