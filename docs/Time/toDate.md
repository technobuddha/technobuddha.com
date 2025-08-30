<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Time](./index.md) / toDate

# Function: toDate()

```ts
function toDate(entity: unknown): Date;
```

Defined in: [to-date.ts:18](https://github.com/technobuddha/library/blob/main/src/to-date.ts#L18)

Converts an unknown entity to a `Date` object.

- If the entity is `null` or `undefined`, returns an invalid `Date` (`new Date(Number.NaN)`).
- If the entity is already a `Date`, returns it as is.
- If the entity is a `string` or `number`, attempts to create a `Date` from it.
- Otherwise, converts the entity to a string and creates a `Date` from that string.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `entity` | `unknown` | The value to convert to a `Date`. |

## Returns

[`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)

A `Date` object representing the input, or an invalid `Date` if conversion is not possible.

