<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / OnLineOptions

# Type Alias: OnLineOptions

```ts
type OnLineOptions = {
  extend?: boolean;
  tolerance?: number;
};
```

Defined in: [is-on-line.ts:10](https://github.com/technobuddha/library/blob/main/src/is-on-line.ts#L10)

Options for the [isOnLine](isOnLine.md) function

## Properties

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="extend"></a> `extend?` | `boolean` | `false` | If true, treats the segments as infinite lines; if false, only considers the actual segments. | [src/is-on-line.ts:20](https://github.com/technobuddha/library/blob/main/src/is-on-line.ts#L20) |
| <a id="tolerance"></a> `tolerance?` | `number` | `1e-10` | Optional tolerance for floating-point comparison. | [src/is-on-line.ts:15](https://github.com/technobuddha/library/blob/main/src/is-on-line.ts#L15) |

