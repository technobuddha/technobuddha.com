<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / ceil

# Function: ceil()

```ts
function ceil(input: number, options: CeilOptions): number;
```

Defined in: [ceil.ts:31](https://github.com/technobuddha/library/blob/main/src/ceil.ts#L31)

Returns the smallest integer greater than or equal to the given number, with optional tolerance and precision adjustments.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `number` | The number to apply the ceiling operation to. |
| `options` | [`CeilOptions`](CeilOptions.md) | Optional configuration object. |

## Returns

`number`

The smallest integer greater than or equal to the adjusted input.

## Example

```typescript
ceil(2.3); // 3
ceil(-2.3); // -2
ceil(2.0001, { tolerance: 0.001 }); // 2
ceil(2.345, { precision: 2 }); // 2.35
```

