<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Time](./index.md) / beginningOfMonth

# Function: beginningOfMonth()

```ts
function beginningOfMonth(input: Date, options: BeginningOfMonthOptions): Date;
```

Defined in: [beginning-of-month.ts:20](https://github.com/technobuddha/library/blob/main/src/beginning-of-month.ts#L20)

Determine the start of the month for a dateDetermine the start of the month for a date

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The date |
| `options` | [`BeginningOfMonthOptions`](BeginningOfMonthOptions.md) | see [BeginningOfMonthOptions](BeginningOfMonthOptions.md) |

## Returns

[`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)

The date value for midnight on the first day of the specified month

## Default Value

```ts
utc false
```

