<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Encoding](./index.md) / Crc32

# Class: Crc32

Defined in: [crc-32.ts:84](https://github.com/technobuddha/library/blob/main/src/crc-32.ts#L84)

Compute the CRC32 checksum of a binary object

## Example

```typescript
const crc = new Crc32();
crc.update('hello world', 'utf8');
crc.digest('hex');
// '0d4a1185'
```
```typescript
const crc = new Crc32();
crc.update(new Uint8Array([0x72,0x69,0x4c,0x4c,0x4f]));
crc.digest('hex');
// 'c031d497'
```

## Extends

- [`HashBase`](HashBase.md)

## Constructors

### Constructor

```ts
new Crc32(): Crc32;
```

Defined in: [src/crc-32.ts:93](https://github.com/technobuddha/library/blob/main/src/crc-32.ts#L93)

Creates a new CRC32 hash instance and initializes its internal state.

#### Returns

`Crc32`

#### Remarks

The CRC value is initialized to -1, as required by the CRC32 algorithm specification.
Use [update](#update) to process data and [digest](#digest) to obtain the final hash value.

#### Overrides

[`HashBase`](HashBase.md).[`constructor`](HashBase.md#constructor)

## Methods

### digest()

#### Call Signature

```ts
digest(): Uint8Array;
```

Defined in: [src/crc-32.ts:116](https://github.com/technobuddha/library/blob/main/src/crc-32.ts#L116)

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

Defined in: [src/crc-32.ts:117](https://github.com/technobuddha/library/blob/main/src/crc-32.ts#L117)

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

Defined in: [src/crc-32.ts:98](https://github.com/technobuddha/library/blob/main/src/crc-32.ts#L98)

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

Defined in: [src/crc-32.ts:99](https://github.com/technobuddha/library/blob/main/src/crc-32.ts#L99)

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

