<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Object](./index.md) / compare

# Function: compare()

```ts
function compare(a: unknown, b: unknown): number;
```

Defined in: [compare.ts:26](https://github.com/technobuddha/library/blob/main/src/compare.ts#L26)

Compare two objects

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `a` | `unknown` | First object |
| `b` | `unknown` | Second object |

## Returns

`number`

- 0 if a == b
- -1 if a \< b
- 1 if a \> b

## Example

```typescript
compare(1, 2); // -1
compare(2, 1); // 1
compare(2, 2); // 0
compare('a', 'b'); // -1
compare('b', 'a'); // 1
compare('a', 'a'); // 0
compare(null, undefined); // -1
compare(undefined, undefined); // 0
compare(NaN, NaN); // 0
```

