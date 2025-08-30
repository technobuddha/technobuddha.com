<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / constructNumber

# Function: constructNumber()

```ts
function constructNumber(deconstructed: Omit<DeconstructedNumber, "value">): number;
```

Defined in: [construct-number.ts:16](https://github.com/technobuddha/library/blob/main/src/construct-number.ts#L16)

Reconstructs a number from its deconstructed representation.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deconstructed` | [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`DeconstructedNumber`](DeconstructedNumber.md), `"value"`\> | An object containing the sign, mantissa, and exponent of the number. |

## Returns

`number`

The reconstructed number.

## Example

```typescript
constructNumber({ sign: 1, mantissa: '123', exponent: 0 }); // 1.23
constructNumber({ sign: -1, mantissa: '500', exponent: 2 }); // -5
constructNumber({ sign: 1, mantissa: '', exponent: 0 }); // 0
```

