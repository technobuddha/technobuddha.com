<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / modulo

# Function: modulo()

```ts
function modulo(dividend: number, divisor: number): number;
```

Defined in: [modulo.ts:24](https://github.com/technobuddha/library/blob/main/src/modulo.ts#L24)

The % operator in JavaScript returns the remainder of a / b, but differs from
some other languages in that the result will have the same sign as the
dividend. For example, -1 % 8 == -1, whereas in some other languages
(such as Python) the result would be 7. This function emulates the more
correct modulo behavior, which is useful for certain applications such as
calculating an offset index in a circular list.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `dividend` | `number` | The dividend. |
| `divisor` | `number` | The divisor. |

## Returns

`number`

`dividend` modulo `divisor`

## Example

```typescript
modulo(7, 5); // 2
modulo(-1, 8); // 7
modulo(10, 3); // 1
modulo(-10, 3); // 2
modulo(10, -3); // -2
modulo(-10, -3); // -1
```

