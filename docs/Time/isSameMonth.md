<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Time](./index.md) / isSameMonth

# Function: isSameMonth()

```ts
function isSameMonth(
   input1: Date, 
   input2: Date, 
   options: SameMonthOptions): boolean;
```

Defined in: [is-same-month.ts:23](https://github.com/technobuddha/library/blob/main/src/is-same-month.ts#L23)

Determine if two dates occur in the same month

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input1` | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The first date |
| `input2` | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The second date |
| `options` | [`SameMonthOptions`](SameMonthOptions.md) | see [SameMonthOptions](SameMonthOptions.md) |

## Returns

`boolean`

true, if the two dates occur in the same month

## Default Value

```ts
utc false
```

