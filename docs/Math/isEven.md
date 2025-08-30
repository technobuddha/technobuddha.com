<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / isEven

# Function: isEven()

```ts
function isEven(input: number): boolean;
```

Defined in: [is-even.ts:18](https://github.com/technobuddha/library/blob/main/src/is-even.ts#L18)

Tests to see if the specified value is an even integer

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `number` | The number to test |

## Returns

`boolean`

true if the number is an even integer

## Example

```typescript
isEven(2); // true
isEven(3); // false
isEven(0); // true
isEven(-4); // true
isEven(2.2); // false
```

