<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Array](./index.md) / lookAhead

# Function: lookAhead()

```ts
function lookAhead<T>(array: T[], options?: LookAheadOptions<T>): Generator<[T, T, number]>;
```

Defined in: [look-ahead.ts:56](https://github.com/technobuddha/library/blob/main/src/look-ahead.ts#L56)

Generates pairs of consecutive elements from the input array, with optional handling for the last
element.

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of elements in the input array. |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `array` | `T`[] | The array to iterate over. |
| `options?` | [`LookAheadOptions`](LookAheadOptions.md)\<`T`\> | Optional configuration for handling the last element. |

## Returns

[`Generator`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Generator)\<\[`T`, `T`, `number`\]\>

A generator yielding a tuple containing each element, the next element in the sequence,
and the index of the element within the sequence.  Optionally, a tuple is generated for the last
element as specified by options.

## Example

```typescript
// Basic usage
const arr = [1, 2, 3];
for (const [current, next] of lookAhead(arr)) {
  console.log(current, next);
}
// [1, 2], [2, 3]

// With wrapAround
for (const [current, next] of lookAhead(arr, { wrapAround: true })) {
  console.log(current, next);
}
// [1, 2], [2, 3], [3, 1]
```

With last
```typescript
for (const [current, next] of lookAhead(arr, { last: 0 })) {
  console.log(current, next);
}
// [1, 2], [2, 3], [3, 0]
```

