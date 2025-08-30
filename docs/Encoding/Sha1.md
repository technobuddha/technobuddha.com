<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Encoding](./index.md) / Sha1

# Class: Sha1

Defined in: [sha-1.ts:118](https://github.com/technobuddha/library/blob/main/src/sha-1.ts#L118)

Secure Hash Algorithm, SHA-1

## Example

```typescript
const sha1 = new Sha1();
sha1.update('hello world', 'utf8');
sha1.digest('hex');
// '2aae6c35c94fcfb415dbe95f408b9ce91ee846ed'
```
```typescript
const sha1 = new Sha1();
sha1.update(new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64]));
sha1.digest('hex');
// '2aae6c35c94fcfb415dbe95f408b9ce91ee846ed'
```

## Extends

- [`ShaBase`](ShaBase.md)

## Constructors

### Constructor

```ts
new Sha1(): Sha1;
```

Defined in: [src/sha-1.ts:134](https://github.com/technobuddha/library/blob/main/src/sha-1.ts#L134)

Creates a new SHA-1 hash instance and initializes its internal state.

#### Returns

`Sha1`

#### Remarks

The internal state variables are set to the initial SHA-1 constants as specified
in FIPS PUB 180-1. Use [update](#update) to process data and [digest](#digest) to retrieve the
final hash value.

#### Overrides

[`ShaBase`](ShaBase.md).[`constructor`](ShaBase.md#constructor)

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

##### Inherited from

[`ShaBase`](ShaBase.md).[`digest`](ShaBase.md#digest)

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

##### Inherited from

[`ShaBase`](ShaBase.md).[`digest`](ShaBase.md#digest)

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

##### Inherited from

[`ShaBase`](ShaBase.md).[`update`](ShaBase.md#update)

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

##### Inherited from

[`ShaBase`](ShaBase.md).[`update`](ShaBase.md#update)

