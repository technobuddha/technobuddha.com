<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / isNegativeZero

# Function: isNegativeZero()

```ts
function isNegativeZero(input: number): boolean;
```

Defined in: [is-negative-zero.ts:15](https://github.com/technobuddha/library/blob/main/src/is-negative-zero.ts#L15)

Tests to see if the specified value is negative zero

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `number` | The number to test |

## Returns

`boolean`

true is the number is negative zero

## Example

```typescript
isNegativeZero(-0); // true
isNegativeZero(0); // false
isNegativeZero(1); // false
isNegativeZero(-1); // false
```

