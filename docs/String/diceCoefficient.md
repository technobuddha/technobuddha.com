<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / diceCoefficient

# Function: diceCoefficient()

```ts
function diceCoefficient(
   input: string, 
   compareTo: string, 
   __nameParameters: DiceCoefficientOptions): number;
```

Defined in: [dice-coefficient.ts:22](https://github.com/technobuddha/library/blob/main/src/dice-coefficient.ts#L22)

Compute the dice coefficient measure of similarity between two strings

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The first string |
| `compareTo` | `string` | The second string |
| `__nameParameters` | [`DiceCoefficientOptions`](DiceCoefficientOptions.md) | see [DiceCoefficientOptions](DiceCoefficientOptions.md) |

## Returns

`number`

a number from 0 (not similar) to 1 (equal) measuring the similarity

