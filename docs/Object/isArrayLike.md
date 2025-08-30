<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Object](./index.md) / isArrayLike

# Function: isArrayLike()

```ts
function isArrayLike(value: unknown): value is ArrayLike<unknown>;
```

Defined in: [is-array-like.ts:45](https://github.com/technobuddha/library/blob/main/src/is-array-like.ts#L45)

Determines whether the provided value is array-like.

A value is considered array-like if it is not null or undefined, is object-like,
is not a function, has a 'length' property, and the length is a valid array length.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `unknown` | The value to check. |

## Returns

`value is ArrayLike<unknown>`

True if the value is array-like, otherwise false.

## Example

```typescript
isArrayLike([1, 2, 3]); // true
isArrayLike('hello'); // true
isArrayLike({ length: 2 }); // true
isArrayLike({}); // false
isArrayLike(() => {}); // false
isArrayLike(null); // false
```

