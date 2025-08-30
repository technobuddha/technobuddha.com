<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / levenshteinDistance

# Function: levenshteinDistance()

```ts
function levenshteinDistance(
   input: string, 
   comparedTo: string, 
   options: LevenshteinDistanceOptions): number;
```

Defined in: [levenshtein-distance.ts:23](https://github.com/technobuddha/library/blob/main/src/levenshtein-distance.ts#L23)

Compute the levenshtein distance between two strings (similarity)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The string |
| `comparedTo` | `string` | The string to compare to |
| `options` | [`LevenshteinDistanceOptions`](LevenshteinDistanceOptions.md) | see [LevenshteinDistanceOptions](LevenshteinDistanceOptions.md) |

## Returns

`number`

the levenshteinDistance between the two strings (0 for no similarity through 1 for equal)

## Default Value

```ts
caseInsensitive true
```

