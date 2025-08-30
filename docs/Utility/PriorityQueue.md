<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Utility](./index.md) / PriorityQueue

# Class: PriorityQueue\<T\>

Defined in: [priority-queue.ts:6](https://github.com/technobuddha/library/blob/main/src/priority-queue.ts#L6)

A simple priority queue

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Constructors

### Constructor

```ts
new PriorityQueue<T>(comparator: (a: T, b: T) => number, contents?: Iterable<T, any, any>): PriorityQueue<T>;
```

Defined in: [src/priority-queue.ts:14](https://github.com/technobuddha/library/blob/main/src/priority-queue.ts#L14)

Creates a new PriorityQueue.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `comparator` | (`a`: `T`, `b`: `T`) => `number` | Function to compare two elements and puts them in priority order. Takes two elements as arguments and returns a number greater, less then or equal to zero. |
| `contents?` | [`Iterable`](https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html#iterable-interface)\<`T`, `any`, `any`\> | Initial contents of the queue |

#### Returns

`PriorityQueue`\<`T`\>

## Accessors

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [src/priority-queue.ts:68](https://github.com/technobuddha/library/blob/main/src/priority-queue.ts#L68)

Determine the number of items in the queue

##### Returns

`number`

number of element in the queue

## Methods

### \[iterator\]()

```ts
iterator: Iterator<T>;
```

Defined in: [src/priority-queue.ts:56](https://github.com/technobuddha/library/blob/main/src/priority-queue.ts#L56)

Iterate through all elements in the queue

#### Returns

[`Iterator`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Iterator)\<`T`\>

generator function

***

### map()

```ts
map<S>(f: (value: T, index: number, array: T[]) => S): S[];
```

Defined in: [src/priority-queue.ts:78](https://github.com/technobuddha/library/blob/main/src/priority-queue.ts#L78)

Transform all elements in the queue

#### Type Parameters

| Type Parameter |
| ------ |
| `S` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `f` | (`value`: `T`, `index`: `number`, `array`: `T`[]) => `S` | Function to transform each element of the queue |

#### Returns

`S`[]

array of transformed queue elements

***

### pop()

```ts
pop(): undefined | T;
```

Defined in: [src/priority-queue.ts:44](https://github.com/technobuddha/library/blob/main/src/priority-queue.ts#L44)

Return and remove the highest priority item from the queue

#### Returns

`undefined` \| `T`

queue element

***

### push()

```ts
push(...o: T[]): void;
```

Defined in: [src/priority-queue.ts:34](https://github.com/technobuddha/library/blob/main/src/priority-queue.ts#L34)

Add an element to the queue

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`o` | `T`[] | element to be added |

#### Returns

`void`

***

### reorder()

```ts
reorder(newComparator: (a: T, b: T) => number): void;
```

Defined in: [src/priority-queue.ts:90](https://github.com/technobuddha/library/blob/main/src/priority-queue.ts#L90)

Change the function used to order the queue

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `newComparator` | (`a`: `T`, `b`: `T`) => `number` | function to compare elements of the queue |

#### Returns

`void`

