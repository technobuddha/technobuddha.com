<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Time](./index.md) / isSameDay

# Function: isSameDay()

```ts
function isSameDay(
   input1: Date, 
   input2: Date, 
   options: SameDayOptions): boolean;
```

Defined in: [is-same-day.ts:23](https://github.com/technobuddha/library/blob/main/src/is-same-day.ts#L23)

Determine if two dates occur on the same day

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input1` | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The first date |
| `input2` | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The second date |
| `options` | [`SameDayOptions`](SameDayOptions.md) | see [SameDayOptions](SameDayOptions.md) |

## Returns

`boolean`

true, if the two dates fall on the same day

## Default Value

```ts
utc false
```

