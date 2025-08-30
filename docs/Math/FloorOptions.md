<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / FloorOptions

# Type Alias: FloorOptions

```ts
type FloorOptions = {
  precision?: number;
  tolerance?: number;
};
```

Defined in: [floor.ts:9](https://github.com/technobuddha/library/blob/main/src/floor.ts#L9)

Options for the [floor](floor.md) function

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="precision"></a> `precision?` | `number` | The number of decimal places to consider when applying the ceiling. Defaults to 0. | [src/floor.ts:13](https://github.com/technobuddha/library/blob/main/src/floor.ts#L13) |
| <a id="tolerance"></a> `tolerance?` | `number` | A small value to add to the input before applying the floor, useful for floating-point tolerance. Defaults to 0. | [src/floor.ts:11](https://github.com/technobuddha/library/blob/main/src/floor.ts#L11) |

