<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Object](./index.md) / isString

# Function: isString()

```ts
function isString(value: unknown): value is string;
```

Defined in: [is-string.ts:20](https://github.com/technobuddha/library/blob/main/src/is-string.ts#L20)

Determines whether the provided value is a string.

This function checks if the value is a primitive string or a String object.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `unknown` | The value to check. |

## Returns

`value is string`

True if the value is a string or a String object, otherwise false.

## Example

```typescript
isString('hello'); // true
isString(new String('hello')); // true
isString(42); // false
isString(['a', 'b']); // false
isString(null); // false
```

