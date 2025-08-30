<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Time](./index.md) / occurrenceInMonth

# Function: occurrenceInMonth()

```ts
function occurrenceInMonth(
   input: Date, 
   dayOfWeek: DayOfWeek, 
   occurrence: number | "last", 
   options: GetOccurrenceInMonthOptions): 
  | null
  | Date;
```

Defined in: [occurrence-in-month.ts:29](https://github.com/technobuddha/library/blob/main/src/occurrence-in-month.ts#L29)

Determine the date of an occurrence of a weekday within a month

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | A date within the month in question |
| `dayOfWeek` | [`DayOfWeek`](DayOfWeek.md) | The day of the week to find the occurrence |
| `occurrence` | `number` \| `"last"` | The occurrence number, or 'last' to find the last occurrence |
| `options` | [`GetOccurrenceInMonthOptions`](GetOccurrenceInMonthOptions.md) | see [GetOccurrenceInMonthOptions](GetOccurrenceInMonthOptions.md) |

## Returns

  \| `null`
  \| [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)

A date object corresponding to the occurrence requested, or null if no such date exists in the month

## Default Value

```ts
utc false
```

