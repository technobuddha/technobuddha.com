<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [English](./index.md) / ConjoinOptions

# Type Alias: ConjoinOptions

```ts
type ConjoinOptions = {
  conjunction?: string;
  oxford?: boolean;
  separator?: string;
};
```

Defined in: [conjoin.ts:9](https://github.com/technobuddha/library/blob/main/src/conjoin.ts#L9)

Options for creating a coordinated list with [conjoin](conjoin.md)

## Properties

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="conjunction"></a> `conjunction?` | `string` | `'and'` | Conjunction to insert in the last position | [src/conjoin.ts:14](https://github.com/technobuddha/library/blob/main/src/conjoin.ts#L14) |
| <a id="oxford"></a> `oxford?` | `boolean` | `true` | If true, use the oxford comma | [src/conjoin.ts:19](https://github.com/technobuddha/library/blob/main/src/conjoin.ts#L19) |
| <a id="separator"></a> `separator?` | `string` | `','` | String used to separate values | [src/conjoin.ts:24](https://github.com/technobuddha/library/blob/main/src/conjoin.ts#L24) |

