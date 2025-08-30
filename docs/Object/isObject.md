<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Object](./index.md) / isObject

# Function: isObject()

```ts
function isObject(value: unknown): value is object;
```

Defined in: [is-object.ts:16](https://github.com/technobuddha/library/blob/main/src/is-object.ts#L16)

Determines whether the provided value is a non-null object.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `unknown` | The value to check. |

## Returns

`value is object`

`true` if the value is an object and not `null`; otherwise, `false`.

## Example

```typescript
isObject({}); // true
isObject([]); // true
isObject(null); // false
isObject(42); // false
isObject('hello'); // false
```

