<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Time](./index.md) / isoWeeksInYear

# Function: isoWeeksInYear()

```ts
function isoWeeksInYear(input: 
  | number
  | Date, options: ISOWeeksInYearOptions): number;
```

Defined in: [iso-weeks-in-year.ts:27](https://github.com/technobuddha/library/blob/main/src/iso-weeks-in-year.ts#L27)

Determine the number of ISO weeks within a year

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | \| `number` \| [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | A date within the year, or a year number |
| `options` | [`ISOWeeksInYearOptions`](ISOWeeksInYearOptions.md) | see [ISOWeeksInYearOptions](ISOWeeksInYearOptions.md) |

## Returns

`number`

The number of weeks in the year (52 or 53)

## Default Value

```ts
weekOneIncludes Thursday
```

