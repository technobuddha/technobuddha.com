<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Time](./index.md) / beginningOfYear

# Function: beginningOfYear()

```ts
function beginningOfYear(input: Date, options: BeginningOfYearOptions): Date;
```

Defined in: [beginning-of-year.ts:22](https://github.com/technobuddha/library/blob/main/src/beginning-of-year.ts#L22)

Determine the start of the year for a date

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The date |
| `options` | [`BeginningOfYearOptions`](BeginningOfYearOptions.md) | see [BeginningOfYearOptions](BeginningOfYearOptions.md) |

## Returns

[`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)

The date value for midnight on the first day of the specified year

## Default Value

```ts
utc false
```

