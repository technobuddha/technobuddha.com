<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Time](./index.md) / endOfMonth

# Function: endOfMonth()

```ts
function endOfMonth(input: Date, options: EndOfMonthOptions): Date;
```

Defined in: [end-of-month.ts:22](https://github.com/technobuddha/library/blob/main/src/end-of-month.ts#L22)

Determine the last day of the month containing the input date

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The date |
| `options` | [`EndOfMonthOptions`](EndOfMonthOptions.md) | see [EndOfMonthOptions](EndOfMonthOptions.md) |

## Returns

[`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)

Midnight on the last day of the month corresponding to the input date

## Default Value

```ts
utc false
```

