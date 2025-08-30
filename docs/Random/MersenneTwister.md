<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Random](./index.md) / MersenneTwister

# Class: MersenneTwister

Defined in: [mersenne-twister.ts:126](https://github.com/technobuddha/library/blob/main/src/mersenne-twister.ts#L126)

Implements the Mersenne Twister pseudorandom number generator (MT19937).

The Mersenne Twister is a widely used PRNG known for its long period (2^19937−1),
high performance, and high-quality randomness. This class provides methods to seed
the generator and produce random numbers in various formats and intervals.

## Remarks

- The generator can be seeded with a single number or an array of numbers.
- Methods are provided to generate 32-bit and 31-bit integers, as well as floating-point numbers
  in different intervals.
- This implementation is based on the original C code by Makoto Matsumoto and Takuji Nishimura.

## Example

```typescript
const mt = new MersenneTwister(1234);
mt.genrandInt32(); // 1982695502
mt.genrandReal1(); // 0.33979119391641377
mt.genrandReal2(); // 0.006705045932903886
mt.genrandRes53(); // 0.489361593755425
```

## See

 - https://en.wikipedia.org/wiki/Mersenne_Twister
 - http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html

## Constructors

### Constructor

```ts
new MersenneTwister(seed: number | number[]): MersenneTwister;
```

Defined in: [src/mersenne-twister.ts:130](https://github.com/technobuddha/library/blob/main/src/mersenne-twister.ts#L130)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `seed` | `number` \| `number`[] |

#### Returns

`MersenneTwister`

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="mt"></a> `mt` | `public` | [`Uint32Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array)\<[`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)\> | [src/mersenne-twister.ts:128](https://github.com/technobuddha/library/blob/main/src/mersenne-twister.ts#L128) |

## Methods

### genrandInt31()

```ts
genrandInt31(): number;
```

Defined in: [src/mersenne-twister.ts:228](https://github.com/technobuddha/library/blob/main/src/mersenne-twister.ts#L228)

#### Returns

`number`

***

### genrandInt32()

```ts
genrandInt32(): number;
```

Defined in: [src/mersenne-twister.ts:196](https://github.com/technobuddha/library/blob/main/src/mersenne-twister.ts#L196)

#### Returns

`number`

***

### genrandReal1()

```ts
genrandReal1(): number;
```

Defined in: [src/mersenne-twister.ts:233](https://github.com/technobuddha/library/blob/main/src/mersenne-twister.ts#L233)

#### Returns

`number`

***

### genrandReal2()

```ts
genrandReal2(): number;
```

Defined in: [src/mersenne-twister.ts:239](https://github.com/technobuddha/library/blob/main/src/mersenne-twister.ts#L239)

#### Returns

`number`

***

### genrandReal3()

```ts
genrandReal3(): number;
```

Defined in: [src/mersenne-twister.ts:245](https://github.com/technobuddha/library/blob/main/src/mersenne-twister.ts#L245)

#### Returns

`number`

***

### genrandRes53()

```ts
genrandRes53(): number;
```

Defined in: [src/mersenne-twister.ts:251](https://github.com/technobuddha/library/blob/main/src/mersenne-twister.ts#L251)

#### Returns

`number`

***

### initByArray()

```ts
initByArray(key: number[]): void;
```

Defined in: [src/mersenne-twister.ts:160](https://github.com/technobuddha/library/blob/main/src/mersenne-twister.ts#L160)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `number`[] |

#### Returns

`void`

***

### initGenrand()

```ts
initGenrand(seed: number): void;
```

Defined in: [src/mersenne-twister.ts:143](https://github.com/technobuddha/library/blob/main/src/mersenne-twister.ts#L143)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `seed` | `number` |

#### Returns

`void`

***

### setSeed()

```ts
setSeed(seed: number | number[]): void;
```

Defined in: [src/mersenne-twister.ts:134](https://github.com/technobuddha/library/blob/main/src/mersenne-twister.ts#L134)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `seed` | `number` \| `number`[] |

#### Returns

`void`

