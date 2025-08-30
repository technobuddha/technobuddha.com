<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Encoding](./index.md) / normalizeBinary

# Function: normalizeBinary()

```ts
function normalizeBinary(input: BinaryObject): Uint8Array;
```

Defined in: [normalize-binary.ts:18](https://github.com/technobuddha/library/blob/main/src/normalize-binary.ts#L18)

Normalizes [BinaryObject](BinaryObject.md) to a `Uint8Array`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`BinaryObject`](BinaryObject.md) | The [BinaryObject](BinaryObject.md) to normalize. |

## Returns

[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

A `Uint8Array` representing the binary data.

## Throws

`TypeError` If the input is not a supported binary object type.

## Example

```typescript
normalizeBinary(new Uint8Array([1, 2, 3])); // Uint8Array([1, 2, 3])
normalizeBinary(new ArrayBuffer(3));        // Uint8Array([0, 0, 0])
normalizeBinary(new DataView(new Uint8Array([4, 5, 6]))); // Uint8Array([4, 5, 6])
normalizeBinary(new Float32Array([1, 2]));  // Uint8Array([...])
```

