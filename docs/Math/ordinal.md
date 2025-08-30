<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / ordinal

# Function: ordinal()

```ts
function ordinal(input: number, options: OrdinalOptions): string;
```

Defined in: [ordinal.ts:75](https://github.com/technobuddha/library/blob/main/src/ordinal.ts#L75)

Convert a number into an ordinal number string (1st, 2nd, 3rd, etc).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `number` | The number to convert |
| `options` | [`OrdinalOptions`](OrdinalOptions.md) | see [OrdinalOptions](OrdinalOptions.md) |

## Returns

`string`

## Example

```typescript
ordinal(1); // "first"
ordinal(2); // "second"
ordinal(3); // "third"
ordinal(21); // "twenty first"
ordinal(101, { and: ' and ' }); // "one hundred and first"
ordinal(2, { output: 'suffix' }); // "nd"
```

