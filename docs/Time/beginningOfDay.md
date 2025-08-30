<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Time](./index.md) / beginningOfDay

# Function: beginningOfDay()

```ts
function beginningOfDay(input: Date, options: BeginningOfDayOptions): Date;
```

Defined in: [beginning-of-day.ts:20](https://github.com/technobuddha/library/blob/main/src/beginning-of-day.ts#L20)

Determine the start of the day for a date

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The date |
| `options` | [`BeginningOfDayOptions`](BeginningOfDayOptions.md) | see [BeginningOfDayOptions](BeginningOfDayOptions.md) |

## Returns

[`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)

The date value for midnight on the specified day

## Default Value

```ts
utc false
```

