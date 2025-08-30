<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / WordwrapOptions

# Type Alias: WordwrapOptions

```ts
type WordwrapOptions = {
  cut?: boolean;
  separator?: string;
  trailingSpaces?: boolean;
  width?: number;
};
```

Defined in: [wordwrap.ts:9](https://github.com/technobuddha/library/blob/main/src/wordwrap.ts#L9)

Options for the [wordwrap](wordwrap.md) function

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="cut"></a> `cut?` | `boolean` | If true, don't limit breaks to word boundaries | [src/wordwrap.ts:15](https://github.com/technobuddha/library/blob/main/src/wordwrap.ts#L15) |
| <a id="separator"></a> `separator?` | `string` | Line separator | [src/wordwrap.ts:13](https://github.com/technobuddha/library/blob/main/src/wordwrap.ts#L13) |
| <a id="trailingspaces"></a> `trailingSpaces?` | `boolean` | If true, spaces are added to the end of each line to make all lines equal width, ignored if cut or preserveSpaces is true | [src/wordwrap.ts:17](https://github.com/technobuddha/library/blob/main/src/wordwrap.ts#L17) |
| <a id="width"></a> `width?` | `number` | The width to wrap to | [src/wordwrap.ts:11](https://github.com/technobuddha/library/blob/main/src/wordwrap.ts#L11) |

