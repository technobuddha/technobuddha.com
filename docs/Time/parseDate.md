<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Time](./index.md) / parseDate

# Function: parseDate()

```ts
function parseDate(input: string): Date;
```

Defined in: [parse-date.ts:68](https://github.com/technobuddha/library/blob/main/src/parse-date.ts#L68)

Parse a string into a Date object

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The string containing a date |

## Returns

[`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)

new Date object

## Remarks

this is a little more generous about what formats it will take for a date, and if it can't match the input to one of it's supported formats it falls
back to new Date(text)

