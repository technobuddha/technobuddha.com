<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / CompareStringsOptions

# Type Alias: CompareStringsOptions

```ts
type CompareStringsOptions = {
  caseInsensitive?: boolean;
  natural?: boolean;
  version?: boolean;
};
```

Defined in: [compare-strings.ts:8](https://github.com/technobuddha/library/blob/main/src/compare-strings.ts#L8)

Options for the [compareStrings](compareStrings.md) function

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="caseinsensitive"></a> `caseInsensitive?` | `boolean` | if true, strings are to be compared case insensitive | [src/compare-strings.ts:10](https://github.com/technobuddha/library/blob/main/src/compare-strings.ts#L10) |
| <a id="natural"></a> `natural?` | `boolean` | if true, compare numeric portions of the string as numbers | [src/compare-strings.ts:12](https://github.com/technobuddha/library/blob/main/src/compare-strings.ts#L12) |
| <a id="version"></a> `version?` | `boolean` | if true, compare strings as version numbers | [src/compare-strings.ts:14](https://github.com/technobuddha/library/blob/main/src/compare-strings.ts#L14) |

