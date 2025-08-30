<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / pad

# Function: pad()

```ts
function pad(input: number, length: number): string;
```

Defined in: [pad.ts:17](https://github.com/technobuddha/library/blob/main/src/pad.ts#L17)

Add leading zeros to a number to ensure a string of a minimum length

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `input` | `number` | `undefined` | The number to pad |
| `length` | `number` | `2` | The minimum length of the resulting string |

## Returns

`string`

number as a string with leading zeros as needed

## Example

```typescript
pad(5); // "05"
pad(42, 4); // "0042"
pad(-7, 3); // "-07"
pad(NaN, 4); // " NaN"
pad(Infinity, 6); // "Infinity"
```

