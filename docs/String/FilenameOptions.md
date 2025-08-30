<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / FilenameOptions

# Type Alias: FilenameOptions

```ts
type FilenameOptions = {
  disambiguate?: number;
  maxLength?: number;
  replacement?: string;
  separator?: string;
};
```

Defined in: [to-filename.ts:16](https://github.com/technobuddha/library/blob/main/src/to-filename.ts#L16)

Options for the [toFilename](toFilename.md) function

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="disambiguate"></a> `disambiguate?` | `number` | number of characters to preserve at the end of the filename when truncated (for disambiguation) | [src/to-filename.ts:22](https://github.com/technobuddha/library/blob/main/src/to-filename.ts#L22) |
| <a id="maxlength"></a> `maxLength?` | `number` | the file name will be truncated to this length | [src/to-filename.ts:18](https://github.com/technobuddha/library/blob/main/src/to-filename.ts#L18) |
| <a id="replacement"></a> `replacement?` | `string` | character to use to replace "bad" characters | [src/to-filename.ts:20](https://github.com/technobuddha/library/blob/main/src/to-filename.ts#L20) |
| <a id="separator"></a> `separator?` | `string` | string to separate the main section from the disambiguated section | [src/to-filename.ts:24](https://github.com/technobuddha/library/blob/main/src/to-filename.ts#L24) |

