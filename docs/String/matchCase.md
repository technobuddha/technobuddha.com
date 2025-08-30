<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / matchCase

# Function: matchCase()

```ts
function matchCase(input: string, target: string): string;
```

Defined in: [match-case.ts:19](https://github.com/technobuddha/library/blob/main/src/match-case.ts#L19)

Attempt to convert the input string into the same case as the target string

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The input string |
| `target` | `string` | The target string |

## Returns

`string`

The input in the case case as the target string

## Remarks

The best guess is made to try to figure out what case the target is in:
 * lowercase
 * UPPERCASE
 * Capitalcase
 * PascalCase

