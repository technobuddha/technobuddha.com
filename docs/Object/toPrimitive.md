<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Object](./index.md) / toPrimitive

# Function: toPrimitive()

```ts
function toPrimitive(input: unknown, hint: "string" | "number" | "default"): unknown;
```

Defined in: [to-primitive.ts:21](https://github.com/technobuddha/library/blob/main/src/to-primitive.ts#L21)

Convert an object into its primitive (string, number, etc.) value

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `input` | `unknown` | `undefined` | the object |
| `hint` | `"string"` \| `"number"` \| `"default"` | `'default'` | A "hint" as to what the type should be. "string", "number" or "default" |

## Returns

`unknown`

primitive value

## Example

```typescript
toPrimitive(42); // 42
toPrimitive('hello'); // 'hello'
toPrimitive(new Number(42)); // 42
toPrimitive(new String('abc')); // 'abc'
toPrimitive({ valueOf() { return 7; } }); // 7
toPrimitive({ toString() { return 'x'; } }, 'string'); // 'x'
```

