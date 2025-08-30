<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Time](./index.md) / endOfWeek

# Function: endOfWeek()

```ts
function endOfWeek(input: Date, options: EndOfWeekOptions): Date;
```

Defined in: [end-of-week.ts:26](https://github.com/technobuddha/library/blob/main/src/end-of-week.ts#L26)

Determine the last day of the week containing a date

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The date |
| `options` | [`EndOfWeekOptions`](EndOfWeekOptions.md) | see [EndOfWeekOptions](EndOfWeekOptions.md) |

## Returns

[`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)

Midnight of the last day of the week containing the input date

## Default Value

```ts
utc false
```

