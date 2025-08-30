<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / compareNumbers

# Function: compareNumbers()

```ts
function compareNumbers(a: null | number, b: null | number): number;
```

Defined in: [compare-numbers.ts:18](https://github.com/technobuddha/library/blob/main/src/compare-numbers.ts#L18)

Compare two numbers

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `a` | `null` \| `number` | First number |
| `b` | `null` \| `number` | Second number |

## Returns

`number`

0 if a == b; -1 if a \< b; 1 if a \> b

## Example

```typescript
compareNumbers(2, 3); // -1
compareNumbers(3, 2); // 1
compareNumbers(2, 2); // 0
compareNumbers(null, 2); // -1
compareNumbers(2, null); // 1
compareNumbers(null, null); // 0
```

