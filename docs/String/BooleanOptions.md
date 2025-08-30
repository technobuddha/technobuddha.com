<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / BooleanOptions

# Type Alias: BooleanOptions

```ts
type BooleanOptions = {
  falseValues?: Iterable<
     | string
    | RegExp>;
  trueValues?: Iterable<
     | string
    | RegExp>;
};
```

Defined in: [to-boolean.ts:8](https://github.com/technobuddha/library/blob/main/src/to-boolean.ts#L8)

Options for the [toBoolean](toBoolean.md) function

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="falsevalues"></a> `falseValues?` | [`Iterable`](https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html#iterable-interface)\< \| `string` \| [`RegExp`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp)\> | An iterable list of values that are "false" | [src/to-boolean.ts:12](https://github.com/technobuddha/library/blob/main/src/to-boolean.ts#L12) |
| <a id="truevalues"></a> `trueValues?` | [`Iterable`](https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html#iterable-interface)\< \| `string` \| [`RegExp`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp)\> | An iterable list of values that are "true" | [src/to-boolean.ts:10](https://github.com/technobuddha/library/blob/main/src/to-boolean.ts#L10) |

