<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Time](./index.md) / isLeapYear

# Function: isLeapYear()

```ts
function isLeapYear(input: 
  | number
  | Date, options: LeapYearOptions): boolean;
```

Defined in: [is-leap-year.ts:19](https://github.com/technobuddha/library/blob/main/src/is-leap-year.ts#L19)

Determine if a year is a leap year

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | \| `number` \| [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | A date, or a year number |
| `options` | [`LeapYearOptions`](LeapYearOptions.md) | see [LeapYearOptions](LeapYearOptions.md) |

## Returns

`boolean`

true, if the specified year is a leap year

