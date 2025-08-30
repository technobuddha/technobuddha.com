<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / mask

# Function: mask()

```ts
function mask(
   input: string, 
   simpleMask: string, 
   options: MaskOptions): string;
```

Defined in: [mask.ts:28](https://github.com/technobuddha/library/blob/main/src/mask.ts#L28)

Use a simple mask to display a string

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The string |
| `simpleMask` | `string` | The mask |
| `options` | [`MaskOptions`](MaskOptions.md) | see [MaskOptions](MaskOptions.md) |

## Returns

`string`

The mask filled with characters from the string

## Remarks

The simple mask is a string where '#' characters are replaced by characters from the input string.  Other characters in the mask
are output as-is, to output a '#' use '\#'

## Default Value

```ts
missing space
```

