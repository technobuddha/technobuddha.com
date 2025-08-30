<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Time](./index.md) / dayOfWeek

# Function: dayOfWeek()

```ts
function dayOfWeek(input: Date, options: DayOfWeekOptions): DayOfWeek;
```

Defined in: [day-of-week.ts:26](https://github.com/technobuddha/library/blob/main/src/day-of-week.ts#L26)

Determine the day of the week for a specific date

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The date |
| `options` | [`DayOfWeekOptions`](DayOfWeekOptions.md) | see [DayOfWeekOptions](DayOfWeekOptions.md) |

## Returns

[`DayOfWeek`](DayOfWeek.md)

The date value for midnight on the first day of the specified year

## Default Value

```ts
utc false
```

