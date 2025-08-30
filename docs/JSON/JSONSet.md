<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [JSON](./index.md) / JSONSet

# Class: JSONSet\<T\>

Defined in: [json-set.ts:27](https://github.com/technobuddha/library/blob/main/src/json-set.ts#L27)

A Set-like collection for objects that can be serialized to JSON.

`JSONSet` stores objects by serializing them to JSON strings, allowing for deep equality
comparison of objects rather than reference equality. This is useful for storing and comparing
objects with the same structure and values, regardless of their references.

## Example

```typescript
const set = new JSONSet<{ a: number }>();
set.add({ a: 1 });
set.has({ a: 1 }); // true
set.has({ a: 2 }); // false
```

## Remarks

- All objects are serialized using a `serialize` function and deserialized with a `deserialize` function.
- The set supports standard set operations such as union, intersection, difference, and symmetricDifference.
- Iteration yields deserialized objects.

## See

Set

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` *extends* `JsonObject` | The type of objects stored in the set. Must extend `JsonObject`. |

## Implements

- [`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)\<`T`\>

## Constructors

### Constructor

```ts
new JSONSet<T>(values?: 
  | null
| Iterable<T, any, any>): JSONSet<T>;
```

Defined in: [src/json-set.ts:30](https://github.com/technobuddha/library/blob/main/src/json-set.ts#L30)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `values?` | \| `null` \| [`Iterable`](https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html#iterable-interface)\<`T`, `any`, `any`\> |

#### Returns

`JSONSet`\<`T`\>

## Properties

| Property | Modifier | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="tostringtag"></a> `[toStringTag]` | `readonly` | `"JSONSet"` | `'JSONSet'` | [src/json-set.ts:38](https://github.com/technobuddha/library/blob/main/src/json-set.ts#L38) |

## Accessors

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [src/json-set.ts:45](https://github.com/technobuddha/library/blob/main/src/json-set.ts#L45)

##### Returns

`number`

the number of (unique) elements in Set.

#### Implementation of

```ts
Set.size
```

## Methods

### \[iterator\]()

```ts
iterator: SetIterator<T>;
```

Defined in: [src/json-set.ts:150](https://github.com/technobuddha/library/blob/main/src/json-set.ts#L150)

#### Returns

`SetIterator`\<`T`\>

#### Implementation of

```ts
Set.[iterator]
```

***

### add()

```ts
add(value: T): this;
```

Defined in: [src/json-set.ts:49](https://github.com/technobuddha/library/blob/main/src/json-set.ts#L49)

Appends a new element with a specified value to the end of the Set.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `T` |

#### Returns

`this`

#### Implementation of

```ts
Set.add
```

***

### clear()

```ts
clear(): void;
```

Defined in: [src/json-set.ts:54](https://github.com/technobuddha/library/blob/main/src/json-set.ts#L54)

#### Returns

`void`

#### Implementation of

```ts
Set.clear
```

***

### delete()

```ts
delete(value: T): boolean;
```

Defined in: [src/json-set.ts:58](https://github.com/technobuddha/library/blob/main/src/json-set.ts#L58)

Removes a specified value from the Set.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `T` |

#### Returns

`boolean`

Returns true if an element in the Set existed and has been removed, or false if the element does not exist.

#### Implementation of

```ts
Set.delete
```

***

### difference()

```ts
difference<U>(other: ReadonlySetLike<U>): Set<T>;
```

Defined in: [src/json-set.ts:62](https://github.com/technobuddha/library/blob/main/src/json-set.ts#L62)

#### Type Parameters

| Type Parameter |
| ------ |
| `U` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `ReadonlySetLike`\<`U`\> |

#### Returns

[`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)\<`T`\>

a new Set containing all the elements in this Set which are not also in the argument.

#### Implementation of

```ts
Set.difference
```

***

### entries()

```ts
entries(): SetIterator<[T, T]>;
```

Defined in: [src/json-set.ts:68](https://github.com/technobuddha/library/blob/main/src/json-set.ts#L68)

Returns an iterable of [v,v] pairs for every value `v` in the set.

#### Returns

`SetIterator`\<\[`T`, `T`\]\>

#### Implementation of

```ts
Set.entries
```

***

### forEach()

```ts
forEach(callback: (value: T, key: T, set: Set<T>) => void, thisArg?: unknown): void;
```

Defined in: [src/json-set.ts:74](https://github.com/technobuddha/library/blob/main/src/json-set.ts#L74)

Executes a provided function once per each value in the Set object, in insertion order.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `callback` | (`value`: `T`, `key`: `T`, `set`: [`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)\<`T`\>) => `void` |
| `thisArg?` | `unknown` |

#### Returns

`void`

#### Implementation of

```ts
Set.forEach
```

***

### has()

```ts
has(value: T): boolean;
```

Defined in: [src/json-set.ts:80](https://github.com/technobuddha/library/blob/main/src/json-set.ts#L80)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `T` |

#### Returns

`boolean`

a boolean indicating whether an element with the specified value exists in the Set or not.

#### Implementation of

```ts
Set.has
```

***

### intersection()

```ts
intersection<U>(other: ReadonlySetLike<U>): Set<T & U>;
```

Defined in: [src/json-set.ts:84](https://github.com/technobuddha/library/blob/main/src/json-set.ts#L84)

#### Type Parameters

| Type Parameter |
| ------ |
| `U` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `ReadonlySetLike`\<`U`\> |

#### Returns

[`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)\<`T` & `U`\>

a new Set containing all the elements which are both in this Set and in the argument.

#### Implementation of

```ts
Set.intersection
```

***

### isDisjointFrom()

```ts
isDisjointFrom(other: ReadonlySetLike<unknown>): boolean;
```

Defined in: [src/json-set.ts:92](https://github.com/technobuddha/library/blob/main/src/json-set.ts#L92)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `ReadonlySetLike`\<`unknown`\> |

#### Returns

`boolean`

a boolean indicating whether this Set has no elements in common with the argument.

#### Implementation of

```ts
Set.isDisjointFrom
```

***

### isSubsetOf()

```ts
isSubsetOf(other: ReadonlySetLike<unknown>): boolean;
```

Defined in: [src/json-set.ts:101](https://github.com/technobuddha/library/blob/main/src/json-set.ts#L101)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `ReadonlySetLike`\<`unknown`\> |

#### Returns

`boolean`

a boolean indicating whether all the elements in this Set are also in the argument.

#### Implementation of

```ts
Set.isSubsetOf
```

***

### isSupersetOf()

```ts
isSupersetOf(other: ReadonlySetLike<unknown>): boolean;
```

Defined in: [src/json-set.ts:110](https://github.com/technobuddha/library/blob/main/src/json-set.ts#L110)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `ReadonlySetLike`\<`unknown`\> |

#### Returns

`boolean`

a boolean indicating whether all the elements in the argument are also in this Set.

#### Implementation of

```ts
Set.isSupersetOf
```

***

### keys()

```ts
keys(): SetIterator<T>;
```

Defined in: [src/json-set.ts:119](https://github.com/technobuddha/library/blob/main/src/json-set.ts#L119)

Despite its name, returns an iterable of the values in the set.

#### Returns

`SetIterator`\<`T`\>

#### Implementation of

```ts
Set.keys
```

***

### symmetricDifference()

```ts
symmetricDifference<U>(other: ReadonlySetLike<U>): Set<T | U>;
```

Defined in: [src/json-set.ts:123](https://github.com/technobuddha/library/blob/main/src/json-set.ts#L123)

#### Type Parameters

| Type Parameter |
| ------ |
| `U` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `ReadonlySetLike`\<`U`\> |

#### Returns

[`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)\<`T` \| `U`\>

a new Set containing all the elements which are in either this Set or in the argument, but not in both.

#### Implementation of

```ts
Set.symmetricDifference
```

***

### union()

```ts
union<U>(other: ReadonlySetLike<U>): Set<T | U>;
```

Defined in: [src/json-set.ts:140](https://github.com/technobuddha/library/blob/main/src/json-set.ts#L140)

#### Type Parameters

| Type Parameter |
| ------ |
| `U` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `ReadonlySetLike`\<`U`\> |

#### Returns

[`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)\<`T` \| `U`\>

a new Set containing all the elements in this Set and also all the elements in the argument.

#### Implementation of

```ts
Set.union
```

***

### values()

```ts
values(): SetIterator<T>;
```

Defined in: [src/json-set.ts:144](https://github.com/technobuddha/library/blob/main/src/json-set.ts#L144)

Returns an iterable of values in the set.

#### Returns

`SetIterator`\<`T`\>

#### Implementation of

```ts
Set.values
```

