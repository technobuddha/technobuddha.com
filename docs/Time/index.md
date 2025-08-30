<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / Time

# Time

### Alteration

| Name | Description |
| ------ | ------ |
| [TimeIncrement](TimeIncrement.md) | Represents amount of time to use for [addTime](addTime.md) |
| [addTime](addTime.md) | Add units of time to a Date |

### Constants

| Variable | Description |
| ------ | ------ |
| [daysPerWeek](daysPerWeek.md) | Number of days in a week [7] |
| [hoursPerDay](hoursPerDay.md) | Number of hours in a day [24] |
| [hoursPerWeek](hoursPerWeek.md) | Number of hours in a week [168] |
| [minutesPerDay](minutesPerDay.md) | Number of minutes in a day [1440] |
| [minutesPerHour](minutesPerHour.md) | Number of minutes in an hour [60] |
| [minutesPerWeek](minutesPerWeek.md) | Number of minutes in a week [10080] |
| [secondsPerDay](secondsPerDay.md) | Number of seconds in a day [86400] |
| [secondsPerHour](secondsPerHour.md) | Number of seconds in an hour [3600] |
| [secondsPerMinute](secondsPerMinute.md) | Number of seconds in a minute [60] |
| [secondsPerWeek](secondsPerWeek.md) | Number of seconds in a week [604800] |
| [ticksPerDay](ticksPerDay.md) | Number of ticks in a day [86400000] |
| [ticksPerHour](ticksPerHour.md) | Number of ticks in an hour [3600000] |
| [ticksPerMinute](ticksPerMinute.md) | Number of ticks in a minute [60000] |
| [ticksPerSecond](ticksPerSecond.md) | Number of ticks in a second [1000] |
| [ticksPerWeek](ticksPerWeek.md) | Number of ticks in a week [604800000] |

### Conversion

| Function | Description |
| ------ | ------ |
| [toDate](toDate.md) | Converts an unknown entity to a `Date` object. |

### Day

| Name | Description |
| ------ | ------ |
| [BeginningOfDayOptions](BeginningOfDayOptions.md) | Options for [beginningOfDay](beginningOfDay.md) |
| [GetOccurrenceInMonthOptions](GetOccurrenceInMonthOptions.md) | Options for [occurrenceInMonth](occurrenceInMonth.md) |
| [MidnightOptions](MidnightOptions.md) | Options for the [isMidnight](isMidnight.md) function |
| [SameDayOptions](SameDayOptions.md) | Options for the [isSameDay](isSameDay.md) function |
| [beginningOfDay](beginningOfDay.md) | Determine the start of the day for a date |
| [isMidnight](isMidnight.md) | Determine if a date is at midnight |
| [isSameDay](isSameDay.md) | Determine if two dates occur on the same day |
| [occurrenceInMonth](occurrenceInMonth.md) | Determine the date of an occurrence of a weekday within a month |

### Enumerations

| Name | Description |
| ------ | ------ |
| [DayOfWeek](DayOfWeek.md) | Days of the week |
| [MonthOfYear](MonthOfYear.md) | Months of the year |
| [day](day.md) | Translation object for name of day to day number. |
| [month](month.md) | Translation object for name of month to month number |

### Formatting

| Name | Description |
| ------ | ------ |
| [FormatDateOptions](FormatDateOptions.md) | Options for formatting a date |
| [formatDate](formatDate.md) | Format a date |

### Julian

| Function | Description |
| ------ | ------ |
| [julian](julian.md) | Get the Julian date (number of days since noon on Monday, January 1 4713 BCE) |

### Month

| Name | Description |
| ------ | ------ |
| [BeginningOfMonthOptions](BeginningOfMonthOptions.md) | Options for the [beginningOfMonth](beginningOfMonth.md) function |
| [DaysInMonthOptions](DaysInMonthOptions.md) | Options for the [daysInMonth](daysInMonth.md) function |
| [EndOfMonthOptions](EndOfMonthOptions.md) | Options for the [endOfMonth](endOfMonth.md) function |
| [SameMonthOptions](SameMonthOptions.md) | Options for the [isSameMonth](isSameMonth.md) function |
| [beginningOfMonth](beginningOfMonth.md) | Determine the start of the month for a dateDetermine the start of the month for a date |
| [daysInMonth](daysInMonth.md) | Determine the number of days in the month for a date |
| [endOfMonth](endOfMonth.md) | Determine the last day of the month containing the input date |
| [isSameMonth](isSameMonth.md) | Determine if two dates occur in the same month |

### Parsing

| Function | Description |
| ------ | ------ |
| [isValidDate](isValidDate.md) | Determine if a date is valid |
| [parseDate](parseDate.md) | Parse a string into a Date object |

### Relative Time

| Name | Description |
| ------ | ------ |
| [RelativeTimeOptions](RelativeTimeOptions.md) | Options for the [relativeTime](relativeTime.md) function |
| [relativeTime](relativeTime.md) | Describe the difference between two dates in a simple format |

### Time Span

| Class | Description |
| ------ | ------ |
| [TimeSpan](TimeSpan.md) | Store and manipulate a duration of time |

### Time Zone

| Name | Description |
| ------ | ------ |
| [TimezoneOptions](TimezoneOptions.md) | Options for the [timezone](timezone.md) function |
| [timezone](timezone.md) | Determine the correct timezone string for a specified date using a local timezone, or an offset in minutes |

### Type Check

| Function | Description |
| ------ | ------ |
| [isDate](isDate.md) | Determines whether the provided value is a `Date` object. |

### Week

| Name | Description |
| ------ | ------ |
| [BeginningOfWeekOptions](BeginningOfWeekOptions.md) | Options for the [beginningOfWeek](beginningOfWeek.md) function |
| [DayOfWeekOptions](DayOfWeekOptions.md) | Options for the [dayOfWeek](dayOfWeek-1.md) function |
| [EndOfWeekOptions](EndOfWeekOptions.md) | Options for the [endOfWeek](endOfWeek.md) function |
| [ISOWeekOfYearOptions](ISOWeekOfYearOptions.md) | Options for the [isoWeekOfYear](isoWeekOfYear.md) function |
| [ISOWeeksInYearOptions](ISOWeeksInYearOptions.md) | Options for the [isoWeeksInYear](isoWeeksInYear.md) function |
| [SameWeekOptions](SameWeekOptions.md) | Options for the [isSameWeek](isSameWeek.md) function |
| [beginningOfWeek](beginningOfWeek.md) | Determine the start of the week for a date |
| [dayOfWeek](dayOfWeek-1.md) | Determine the day of the week for a specific date |
| [endOfWeek](endOfWeek.md) | Determine the last day of the week containing a date |
| [isoWeekOfYear](isoWeekOfYear.md) | Determine the ISO week number for a given date |
| [isoWeeksInYear](isoWeeksInYear.md) | Determine the number of ISO weeks within a year |
| [isSameWeek](isSameWeek.md) | Determine if two dates occur in the same week |

### Year

| Name | Description |
| ------ | ------ |
| [BeginningOfYearOptions](BeginningOfYearOptions.md) | Options for the [beginningOfYear](beginningOfYear.md) function |
| [DayOfYearOptions](DayOfYearOptions.md) | Options for the [dayOfYear](dayOfYear.md) function |
| [EndOfYearOptions](EndOfYearOptions.md) | Options for the [endOfYear](endOfYear.md) function |
| [LeapYearOptions](LeapYearOptions.md) | Options for the [isLeapYear](isLeapYear.md) function |
| [SameYearOptions](SameYearOptions.md) | Options for the [isSameYear](isSameYear.md) function |
| [beginningOfYear](beginningOfYear.md) | Determine the start of the year for a date |
| [dayOfYear](dayOfYear.md) | Calculates the day of the year for a given date. |
| [endOfYear](endOfYear.md) | Determine the last day of the year containing a date |
| [isLeapYear](isLeapYear.md) | Determine if a year is a leap year |
| [isSameYear](isSameYear.md) | Determine if two dates occur in the same year |
