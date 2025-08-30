<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / QuoteOptions

# Type Alias: QuoteOptions

```ts
type QuoteOptions = {
  escape?: string | (input: string) => string;
  quote?: string;
};
```

Defined in: [quote.ts:10](https://github.com/technobuddha/library/blob/main/src/quote.ts#L10)

Options for the [quote](quote.md) and [unquote](unquote.md) function

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="escape"></a> `escape?` | `string` \| (`input`: `string`) => `string` | Character sequence to replace the quote mark within the text, or function to return the properly escaped text | [src/quote.ts:14](https://github.com/technobuddha/library/blob/main/src/quote.ts#L14) |
| <a id="quote"></a> `quote?` | `string` | The quote character(s) to use | [src/quote.ts:12](https://github.com/technobuddha/library/blob/main/src/quote.ts#L12) |

