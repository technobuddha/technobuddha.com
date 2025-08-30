<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / binaryUnits

# Function: binaryUnits()

```ts
function binaryUnits(input: number, options: BinaryUnitsOptions): string;
```

Defined in: [binary-units.ts:26](https://github.com/technobuddha/library/blob/main/src/binary-units.ts#L26)

Abbreviate a binary number by adding a suffix for metric units (i.e. 1024 =\> 1KiB)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `number` | The number to abbreviate |
| `options` | [`BinaryUnitsOptions`](BinaryUnitsOptions.md) | see [BinaryUnitsOptions](BinaryUnitsOptions.md) |

## Returns

`string`

## Example

```typescript
binaryUnits(1024); // '1KiB'
binaryUnits(1048576); // '1MiB'
binaryUnits(1536); // '1.5KiB'
binaryUnits(500); // '500B'
binaryUnits(0); // '0B'
```

