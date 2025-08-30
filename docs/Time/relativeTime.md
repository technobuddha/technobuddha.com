<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Time](./index.md) / relativeTime

# Function: relativeTime()

```ts
function relativeTime(
   input: Date, 
   relativeTo: Date, 
   options: RelativeTimeOptions): string;
```

Defined in: [relative-time.ts:34](https://github.com/technobuddha/library/blob/main/src/relative-time.ts#L34)

Describe the difference between two dates in a simple format

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The date |
| `relativeTo` | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The date to compare to |
| `options` | [`RelativeTimeOptions`](RelativeTimeOptions.md) | see [RelativeTimeOptions](RelativeTimeOptions.md) |

## Returns

`string`

string describing the time difference between the two dates

