<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / groupCode

# Function: groupCode()

```ts
function groupCode(input: string): string;
```

Defined in: [group-code.ts:14](https://github.com/technobuddha/library/blob/main/src/group-code.ts#L14)

Determine the group code (A-Z, [] or #) to place an item under

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | a description |

## Returns

`string`

The group code

## Remarks

The group code is made by taking the first letter of the *description*.  As a special
case descriptions starting with '[' are grouped under [] and anything that isn't a letter is grouped
under #.

