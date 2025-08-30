<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / isOdd

# Function: isOdd()

```ts
function isOdd(input: number): boolean;
```

Defined in: [is-odd.ts:18](https://github.com/technobuddha/library/blob/main/src/is-odd.ts#L18)

Tests to see if the specified value is an odd integer

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `number` | The number to test |

## Returns

`boolean`

true if the number is an odd integer

## Example

```typescript
isOdd(1); // true
isOdd(2); // false
isOdd(0); // false
isOdd(-3); // true
isOdd(3.1); // false
```

