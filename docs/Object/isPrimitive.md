<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Object](./index.md) / isPrimitive

# Function: isPrimitive()

```ts
function isPrimitive(input: unknown): input is undefined | null | string | number | bigint | boolean | symbol;
```

Defined in: [is-primitive.ts:18](https://github.com/technobuddha/library/blob/main/src/is-primitive.ts#L18)

Check to see if an object is a primitive

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `unknown` | object to test |

## Returns

input is undefined \| null \| string \| number \| bigint \| boolean \| symbol

true, if the object is a primitive

## Example

```typescript
isPrimitive(42); // true
isPrimitive('hello'); // true
isPrimitive(null); // true
isPrimitive(undefined); // true
isPrimitive(Symbol('s')); // true
isPrimitive({}); // false
isPrimitive([]); // false
```

