<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Object](./index.md) / shallowEquals

# Function: shallowEquals()

```ts
function shallowEquals(
   objA: 
  | undefined
  | null
  | Record<string, unknown>, 
   objB: 
  | undefined
  | null
  | Record<string, unknown>, 
   exclude: string[]): boolean;
```

Defined in: [shallow-equals.ts:38](https://github.com/technobuddha/library/blob/main/src/shallow-equals.ts#L38)

Compare two object for equality.  Testing goes one level deep.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `objA` | \| `undefined` \| `null` \| [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `unknown`\> | `undefined` | First object to compare |
| `objB` | \| `undefined` \| `null` \| [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `unknown`\> | `undefined` | Second object to compare |
| `exclude` | `string`[] | `[]` | Array of key names to exclude from the comparison |

## Returns

`boolean`

true if the two objects have the same members

## Example

```typescript
const a = \{ x: 1, y: 2 \};
const b = \{ x: 1, y: 2 \};
shallowEquals(a, b); // true
shallowEquals(a, \{ x: 1 \}); // false
shallowEquals(a, \{ x: 1, y: 3 \}); // false
shallowEquals(a, b, ['y']); // true
```

