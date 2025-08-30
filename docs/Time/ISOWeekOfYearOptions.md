<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Time](./index.md) / ISOWeekOfYearOptions

# Type Alias: ISOWeekOfYearOptions

```ts
type ISOWeekOfYearOptions = {
  firstDayOfWeek?: DayOfWeek;
  utc?: boolean;
  weekOneIncludes?: DayOfWeek;
};
```

Defined in: [iso-week-of-year.ts:12](https://github.com/technobuddha/library/blob/main/src/iso-week-of-year.ts#L12)

Options for the [isoWeekOfYear](isoWeekOfYear.md) function

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="firstdayofweek"></a> `firstDayOfWeek?` | [`DayOfWeek`](DayOfWeek.md) | The first day of the week | [src/iso-week-of-year.ts:18](https://github.com/technobuddha/library/blob/main/src/iso-week-of-year.ts#L18) |
| <a id="utc"></a> `utc?` | `boolean` | Use the utc timezone | [src/iso-week-of-year.ts:14](https://github.com/technobuddha/library/blob/main/src/iso-week-of-year.ts#L14) |
| <a id="weekoneincludes"></a> `weekOneIncludes?` | [`DayOfWeek`](DayOfWeek.md) | Week 1 is defined as the week with the Gregorian year's first [weekOneIncludes] day in it | [src/iso-week-of-year.ts:16](https://github.com/technobuddha/library/blob/main/src/iso-week-of-year.ts#L16) |

