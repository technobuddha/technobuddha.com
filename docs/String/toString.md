<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / toString

# Function: toString()

```ts
function toString(value: unknown): string;
```

Defined in: [to-string.ts:18](https://github.com/technobuddha/library/blob/main/src/to-string.ts#L18)

Converts an unknown value to its string representation.

- Returns an empty string if the value is `null` or `undefined`.
- Returns the value itself if it is a string.
- Converts booleans to `'true'` or `'false'`.
- Converts symbols and bigints using their respective `toString` methods.
- Returns a string representation for functions in the format `function <name>();`.
- Converts numbers using their `toString` method.
- For all other types, returns the result of `Object.prototype.toString`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `unknown` | The value to convert to a string. |

## Returns

`string`

The string representation of the input value.

