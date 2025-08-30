<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Time](./index.md) / julian

# Function: julian()

```ts
function julian(input: Date): number;
```

Defined in: [julian.ts:11](https://github.com/technobuddha/library/blob/main/src/julian.ts#L11)

Get the Julian date (number of days since noon on Monday, January 1 4713 BCE)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The date and time to convert |

## Returns

`number`

The julian date.

## Remarks

Julian dates are always in the UTC timezone

