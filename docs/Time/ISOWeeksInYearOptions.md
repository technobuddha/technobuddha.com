<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Time](./index.md) / ISOWeeksInYearOptions

# Type Alias: ISOWeeksInYearOptions

```ts
type ISOWeeksInYearOptions = {
  utc?: boolean;
  weekOneIncludes?: DayOfWeek;
};
```

Defined in: [iso-weeks-in-year.ts:11](https://github.com/technobuddha/library/blob/main/src/iso-weeks-in-year.ts#L11)

Options for the [isoWeeksInYear](isoWeeksInYear.md) function

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="utc"></a> `utc?` | `boolean` | Use the utc timezone | [src/iso-weeks-in-year.ts:13](https://github.com/technobuddha/library/blob/main/src/iso-weeks-in-year.ts#L13) |
| <a id="weekoneincludes"></a> `weekOneIncludes?` | [`DayOfWeek`](DayOfWeek.md) | Week 1 is defined as the week with the Gregorian year's first [weekOneIncludes] day in it | [src/iso-weeks-in-year.ts:15](https://github.com/technobuddha/library/blob/main/src/iso-weeks-in-year.ts#L15) |

