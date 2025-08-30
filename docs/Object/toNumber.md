<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Object](./index.md) / toNumber

# Function: toNumber()

```ts
function toNumber(entity: unknown): number;
```

Defined in: [to-number.ts:21](https://github.com/technobuddha/library/blob/main/src/to-number.ts#L21)

Convert an entity to a number.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `entity` | `unknown` | The entity to convert, the entity will attempt to be converted as a number, a boolean or a string |

## Returns

`number`

The entity as a number, or NaN if it cannot be converted

## Example

```typescript
toNumber(42); // 42
toNumber(true); // 1
toNumber(false); // 0
toNumber('123.45'); // 123.45
toNumber('abc'); // NaN
toNumber(null); // NaN
```

