<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / CeilOptions

# Type Alias: CeilOptions

```ts
type CeilOptions = {
  precision?: number;
  tolerance?: number;
};
```

Defined in: [ceil.ts:9](https://github.com/technobuddha/library/blob/main/src/ceil.ts#L9)

Options for the [ceil](ceil.md) function

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="precision"></a> `precision?` | `number` | The number of decimal places to consider when applying the ceiling. Defaults to 0. | [src/ceil.ts:13](https://github.com/technobuddha/library/blob/main/src/ceil.ts#L13) |
| <a id="tolerance"></a> `tolerance?` | `number` | A small value to subtract from the input before applying the ceiling, useful for floating-point tolerance. Defaults to 0. | [src/ceil.ts:11](https://github.com/technobuddha/library/blob/main/src/ceil.ts#L11) |

