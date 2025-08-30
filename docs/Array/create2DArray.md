<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Array](./index.md) / create2DArray

# Function: create2DArray()

```ts
function create2DArray<T>(
   width: number, 
   height: number, 
   fill: T | (this: void, x: number, y: number) => T): T[][];
```

Defined in: [create-2-d-array.ts:22](https://github.com/technobuddha/library/blob/main/src/create-2-d-array.ts#L22)

Create a two dimensional array with all elements initialized

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | Type of the elements in the array |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `width` | `number` | Width of the array |
| `height` | `number` | Height of the array |
| `fill` | `T` \| (`this`: `void`, `x`: `number`, `y`: `number`) => `T` | Value to fill the array, or a function returning the fill value for each element |

## Returns

`T`[][]

## Remarks

Array is accessed by
```js
array[w][h]
```

## Example

```typescript
create2DArray(2, 3, 0);  // [[0, 0, 0], [0, 0, 0]]

create2DArray(2, 3, (x, y) => x + y); // [[0, 1, 2], [1, 2, 3]]
```

