<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Object](./index.md) / isRegExp

# Function: isRegExp()

```ts
function isRegExp(value: unknown): value is RegExp;
```

Defined in: [is-reg-exp.ts:18](https://github.com/technobuddha/library/blob/main/src/is-reg-exp.ts#L18)

Determines whether the provided value is a `RegExp` object.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `unknown` | The value to test. |

## Returns

`value is RegExp`

`true` if the value is a `RegExp` object; otherwise, `false`.

## Example

```typescript
isRegExp(/abc/); // true
isRegExp(new RegExp('abc')); // true
isRegExp('abc'); // false
isRegExp({}); // false
isRegExp(null); // false
```

