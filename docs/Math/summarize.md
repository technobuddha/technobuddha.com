<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / summarize

# Function: summarize()

```ts
function summarize(input: number): string;
```

Defined in: [summarize.ts:19](https://github.com/technobuddha/library/blob/main/src/summarize.ts#L19)

Get a short description of a number

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `number` | number to convert |

## Returns

`string`

number as text

## Remarks

this is a shortcut to calling cardinal with options {groups: 1, digits: true}

## Example

```typescript
summarize(1000000); // "1 million"
summarize(101323847382459); // "101 trillion"
summarize(1234); // "1.23 thousand"
summarize(0.00056); // "560 millionths"
```

