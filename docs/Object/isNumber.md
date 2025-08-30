<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Object](./index.md) / isNumber

# Function: isNumber()

```ts
function isNumber(value: unknown): value is number;
```

Defined in: [is-number.ts:16](https://github.com/technobuddha/library/blob/main/src/is-number.ts#L16)

Determines whether the provided value is a number or a Number object.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `unknown` | The value to test. |

## Returns

`value is number`

True if the value is a number or a Number object; otherwise, false.

## Example

```typescript
isNumber(42); // true
isNumber(new Number(42)); // true
isNumber(NaN); // true
isNumber('42'); // false
isNumber(null); // false
```

