<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Object](./index.md) / clear

# Function: clear()

```ts
function clear<T>(input: Record<string | number | symbol, T>): Record<string | number | symbol, T>;
```

Defined in: [clear.ts:15](https://github.com/technobuddha/library/blob/main/src/clear.ts#L15)

Delete all own enumerable string properties from an object

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `T` | `unknown` | Type of values within the object |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string` \| `number` \| `symbol`, `T`\> | Object to clear all properties |

## Returns

[`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string` \| `number` \| `symbol`, `T`\>

Original input with all properties deleted.

## Remarks

The input argument is mutated in place

## Example

```typescript
const obj = \{ a: 1, b: 2 \};
clear(obj); // obj is now \{\}
```

