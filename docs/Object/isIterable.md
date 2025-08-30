<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Object](./index.md) / isIterable

# Function: isIterable()

```ts
function isIterable(obj: unknown): obj is Iterable<unknown, any, any>;
```

Defined in: [is-iterable.ts:19](https://github.com/technobuddha/library/blob/main/src/is-iterable.ts#L19)

Determines if the provided object is iterable.

Checks whether the given value is not `null` or `undefined` and has a `[Symbol.iterator]` method,
indicating that it implements the `Iterable` interface.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `obj` | `unknown` | The value to check for iterability. |

## Returns

`obj is Iterable<unknown, any, any>`

`true` if the object is iterable, otherwise `false`.

## Example

```typescript
isIterable([1, 2, 3]); // true
isIterable('hello');   // true
isIterable(new Map()); // true
isIterable(123);       // false
isIterable(null);      // false
```

