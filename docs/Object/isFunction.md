<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Object](./index.md) / isFunction

# Function: isFunction()

```ts
function isFunction(value: unknown): value is Function;
```

Defined in: [is-function.ts:24](https://github.com/technobuddha/library/blob/main/src/is-function.ts#L24)

Determines whether the provided value is a function.

This includes regular functions, generator functions, async functions, and proxies
that behave like functions. It uses both `typeof` and `Object.prototype.toString`
checks to ensure accurate detection.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `unknown` | The value to test. |

## Returns

`value is Function`

True if the value is a function, otherwise false.

## Example

```typescript
isFunction(function() {}); // true
isFunction(() => {}); // true
isFunction(async function() {}); // true
isFunction(function* () {}); // true
isFunction(null); // false
isFunction({}); // false
```

