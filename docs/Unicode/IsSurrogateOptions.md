<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Unicode](./index.md) / IsSurrogateOptions

# Type Alias: IsSurrogateOptions

```ts
type IsSurrogateOptions = {
  high?: boolean;
  low?: boolean;
};
```

Defined in: [is-surrogate.ts:6](https://github.com/technobuddha/library/blob/main/src/is-surrogate.ts#L6)

Options for [isSurrogate](isSurrogate.md)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="high"></a> `high?` | `boolean` | test for high surrogates (D800-DBFF) | [src/is-surrogate.ts:8](https://github.com/technobuddha/library/blob/main/src/is-surrogate.ts#L8) |
| <a id="low"></a> `low?` | `boolean` | test for low surrogates (DC00-DFFF) | [src/is-surrogate.ts:10](https://github.com/technobuddha/library/blob/main/src/is-surrogate.ts#L10) |

