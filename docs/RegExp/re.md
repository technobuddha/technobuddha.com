<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [RegExp](./index.md) / re

# Function: re()

```ts
function re(template: TemplateStringsArray, ...args: RegExp[]): RegExp;
```

Defined in: [re.ts:18](https://github.com/technobuddha/library/blob/main/src/re.ts#L18)

Constructs a new `RegExp` by interpolating template strings and provided regular expressions.

This function allows you to compose regular expressions using template literals,
automatically merging flags and wrapping interpolated regex sources as non-capturing groups
when appropriate.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `template` | `TemplateStringsArray` | The template string array containing the literal parts of the pattern. |
| ...`args` | [`RegExp`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp)[] | The regular expressions to interpolate into the template. |

## Returns

[`RegExp`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp)

A new `RegExp` object with the combined pattern and merged flags.

