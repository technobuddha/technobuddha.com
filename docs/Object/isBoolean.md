<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Object](./index.md) / isBoolean

# Function: isBoolean()

```ts
function isBoolean(value: unknown): value is boolean;
```

Defined in: [is-boolean.ts:16](https://github.com/technobuddha/library/blob/main/src/is-boolean.ts#L16)

Determines whether the provided value is a boolean or a Boolean object.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `unknown` | The value to test. |

## Returns

`value is boolean`

True if the value is a primitive boolean or a Boolean object; otherwise, false.

## Example

```typescript
isBoolean(true); // true
isBoolean(false); // true
isBoolean(new Boolean(false)); // true
isBoolean(0); // false
isBoolean('true'); // false
```

