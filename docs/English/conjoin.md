<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [English](./index.md) / conjoin

# Function: conjoin()

```ts
function conjoin<T>(input: ArrayLike<T>, options: ConjoinOptions): string;
```

Defined in: [conjoin.ts:46](https://github.com/technobuddha/library/blob/main/src/conjoin.ts#L46)

Create a list from an array, separating values and inserting a conjunction

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `ArrayLike`\<`T`\> | Array of values |
| `options` | [`ConjoinOptions`](ConjoinOptions.md) | see [ConjoinOptions](ConjoinOptions.md) |

## Returns

`string`

## Example

```typescript
const stooges = ['Larry', 'Moe', 'Curly'];
conjoin(stooges);
// 'Larry, Moe, and Curly'
```
```typescript
const amigos = ['Lucky Day', 'Dusty Bottoms', 'Ned Nederlander'];
conjoin(amigos, { conjunction: 'or', oxford: false, separator: ';' });
// 'Lucky Day; Dusty Bottoms or Ned Nederlander'
```

