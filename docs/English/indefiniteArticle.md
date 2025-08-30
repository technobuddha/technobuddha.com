<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [English](./index.md) / indefiniteArticle

# Function: indefiniteArticle()

```ts
function indefiniteArticle(word: string, options: IndefiniteArticleOptions): string;
```

Defined in: [indefinite-article.ts:47](https://github.com/technobuddha/library/blob/main/src/indefinite-article.ts#L47)

Determine the appropriate indefinite article to use with a word.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `word` | `string` | The word |
| `options` | [`IndefiniteArticleOptions`](IndefiniteArticleOptions.md) | see [IndefiniteArticleOptions](IndefiniteArticleOptions.md) |

## Returns

`string`

The appropriate indefinite article ("a" or "an") combined with the input word.  If the only
option is used, only the indefinite article is returned.

## Remarks

The answer is derived from a simple rules engine, it attempts to cover most exceptions
to the rules, but the English language has lots of quirks, and this rules engine can not cover them
all

