<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / compareStrings

# Function: compareStrings()

```ts
function compareStrings(
   a: null | string, 
   b: null | string, 
   caseInsensitive: CompareStringsOptions): number;
```

Defined in: [compare-strings.ts:29](https://github.com/technobuddha/library/blob/main/src/compare-strings.ts#L29)

Compare two strings

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `a` | `null` \| `string` | First string |
| `b` | `null` \| `string` | Second string |
| `caseInsensitive` | [`CompareStringsOptions`](CompareStringsOptions.md) | True if strings are to be compared case insensitive (default false) |

## Returns

`number`

0 if a == b; -1 if a \< b; 1 if a \> b

## Default Value

```ts
caseInsensitive false
```

## Default Value

```ts
natural false
```

## Default Value

```ts
version false
```

