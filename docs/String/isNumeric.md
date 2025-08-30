<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / isNumeric

# Function: isNumeric()

```ts
function isNumeric(input: unknown): input is string | number;
```

Defined in: [is-numeric.ts:13](https://github.com/technobuddha/library/blob/main/src/is-numeric.ts#L13)

Test an object to see if it a number, or a string which can be converted into a number

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `unknown` | the object to test |

## Returns

input is string \| number

true, if the object is a number, or can be converted to a number

