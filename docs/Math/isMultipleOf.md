<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / isMultipleOf

# Function: isMultipleOf()

```ts
function isMultipleOf(input: number, multiplier: number): boolean;
```

Defined in: [is-multiple-of.ts:20](https://github.com/technobuddha/library/blob/main/src/is-multiple-of.ts#L20)

Tests to see if the specified value is an multiple of *multiplier*

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `number` | The number to test |
| `multiplier` | `number` | The multiplier |

## Returns

`boolean`

true, if the number is a multiple

## Example

```typescript
isMultipleOf(6, 3); // true
isMultipleOf(7, 3); // false
isMultipleOf(0, 5); // true
isMultipleOf(10, 2); // true
isMultipleOf(10, 0); // false
isMultipleOf(0, 0); // true
```

