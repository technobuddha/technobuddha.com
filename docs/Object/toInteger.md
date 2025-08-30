<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Object](./index.md) / toInteger

# Function: toInteger()

```ts
function toInteger(entity: unknown): number;
```

Defined in: [to-integer.ts:21](https://github.com/technobuddha/library/blob/main/src/to-integer.ts#L21)

Convert an entity to a integer number.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `entity` | `unknown` | The entity to convert, the entity will attempt to be converted as a number, a boolean or a string |

## Returns

`number`

The entity as a number, or NaN if it cannot be converted

## Example

```typescript
toInteger(42.7); // 42
toInteger(true); // 1
toInteger(false); // 0
toInteger('123'); // 123
toInteger('abc'); // NaN
toInteger(null); // NaN
```

