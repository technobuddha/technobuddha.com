<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Encoding](./index.md) / ShaBase

# Abstract Class: ShaBase

Defined in: [sha-base.ts:14](https://github.com/technobuddha/library/blob/main/src/sha-base.ts#L14)

The base class for sha based cryptographic hash functions

## Extends

- [`HashBase`](HashBase.md)

## Extended by

- [`Sha1`](Sha1.md)
- [`Sha224`](Sha224.md)
- [`Sha256`](Sha256.md)
- [`Sha384`](Sha384.md)
- [`Sha512`](Sha512.md)

## Constructors

### Constructor

```ts
new ShaBase(blockSize: number, finalSize: number): ShaBase;
```

Defined in: [src/sha-base.ts:45](https://github.com/technobuddha/library/blob/main/src/sha-base.ts#L45)

Creates a new instance of the hash base class.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `blockSize` | `number` | The size of the internal block buffer in bytes. |
| `finalSize` | `number` | The size of the final hash output in bytes. |

#### Returns

`ShaBase`

#### Overrides

[`HashBase`](HashBase.md).[`constructor`](HashBase.md#constructor)

## Methods

### digest()

#### Call Signature

```ts
digest(): Uint8Array;
```

Defined in: [src/sha-base.ts:77](https://github.com/technobuddha/library/blob/main/src/sha-base.ts#L77)

Finalizes the hash computation and returns the resulting hash digest.
This method performs any necessary padding and processes the final block
of data according to the hash algorithm's specification.

##### Returns

[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

The hash digest

##### Overrides

[`HashBase`](HashBase.md).[`digest`](HashBase.md#digest)

#### Call Signature

```ts
digest(encoding: BinaryEncoding): string;
```

Defined in: [src/sha-base.ts:78](https://github.com/technobuddha/library/blob/main/src/sha-base.ts#L78)

Finalizes the hash computation and returns the resulting hash digest.
This method performs any necessary padding and processes the final block
of data according to the hash algorithm's specification.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `encoding` | [`BinaryEncoding`](BinaryEncoding.md) | Optional. The encoding to use for the output digest (e.g., 'hex', 'base64'). |

##### Returns

`string`

An encoded string, depending on the `encoding` parameter.

##### Overrides

[`HashBase`](HashBase.md).[`digest`](HashBase.md#digest)

***

### update()

#### Call Signature

```ts
update(data: 
  | TypedArray
  | ArrayLike<number>
  | ArrayBuffer): this;
```

Defined in: [src/sha-base.ts:119](https://github.com/technobuddha/library/blob/main/src/sha-base.ts#L119)

Updates the hash with the given binary data.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | \| [`TypedArray`](../Utility/TypedArray.md) \| `ArrayLike`\<`number`\> \| [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | The data to update the hash with, as a TypedArray or ArrayBuffer. |

##### Returns

`this`

The hash instance for method chaining.

##### Overrides

[`HashBase`](HashBase.md).[`update`](HashBase.md#update)

#### Call Signature

```ts
update(data: string, encoding?: TextEncoding): this;
```

Defined in: [src/sha-base.ts:120](https://github.com/technobuddha/library/blob/main/src/sha-base.ts#L120)

Updates the hash with the given string data.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `string` | The string data to update the hash with. |
| `encoding?` | [`TextEncoding`](../Unicode/TextEncoding.md) | Optional text encoding of the input string (e.g., 'utf8'). |

##### Returns

`this`

The hash instance for method chaining.

##### Overrides

[`HashBase`](HashBase.md).[`update`](HashBase.md#update)

