<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Unicode](./index.md) / isSurrogate

# Function: isSurrogate()

```ts
function isSurrogate(input: string, options: IsSurrogateOptions): boolean;
```

Defined in: [is-surrogate.ts:23](https://github.com/technobuddha/library/blob/main/src/is-surrogate.ts#L23)

Determine is a character is a surrogate

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | the character to test |
| `options` | [`IsSurrogateOptions`](IsSurrogateOptions.md) | see [IsSurrogateOptions](IsSurrogateOptions.md) |

## Returns

`boolean`

true if the specified character is a unicode surrogate

## Default Value

```ts
high true
```

## Default Value

```ts
low true
```

