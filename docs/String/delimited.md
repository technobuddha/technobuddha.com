<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / delimited

# Function: delimited()

```ts
function delimited(
   input: string, 
   delimiter: string, 
   index: number, 
   count: number): string;
```

Defined in: [delimited.ts:12](https://github.com/technobuddha/library/blob/main/src/delimited.ts#L12)

Return a field from a delimited string

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `input` | `string` | `undefined` | The delimited string |
| `delimiter` | `string` | `undefined` | The delimiter string |
| `index` | `number` | `0` | The position of the desired field, 0 is the first field, negative numbers count backwards from the end (default 0) |
| `count` | `number` | `1` | The number of fields to return (default 1) |

## Returns

`string`

