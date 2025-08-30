<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Time](./index.md) / endOfYear

# Function: endOfYear()

```ts
function endOfYear(input: Date, options: EndOfYearOptions): Date;
```

Defined in: [end-of-year.ts:22](https://github.com/technobuddha/library/blob/main/src/end-of-year.ts#L22)

Determine the last day of the year containing a date

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The date |
| `options` | [`EndOfYearOptions`](EndOfYearOptions.md) | see [EndOfYearOptions](EndOfYearOptions.md) |

## Returns

[`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)

Midnight of the last day of the year containing the input date

## Default Value

```ts
utc false
```

