<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [JSON](./index.md) / reviver

# Function: reviver()

```ts
function reviver(
   this: unknown, 
   _key: string, 
   value: unknown): unknown;
```

Defined in: [reviver.ts:12](https://github.com/technobuddha/library/blob/main/src/reviver.ts#L12)

Used with JSON.parse to decode objected encoded by [replacer](replacer.md)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | `unknown` | The raw object |
| `_key` | `string` | The key |
| `value` | `unknown` | The value |

## Returns

`unknown`

the decoded value

