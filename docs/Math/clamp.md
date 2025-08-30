<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Math](./index.md) / clamp

# Function: clamp()

```ts
function clamp(
   value: number, 
   min: number, 
   max: number): number;
```

Defined in: [clamp.ts:17](https://github.com/technobuddha/library/blob/main/src/clamp.ts#L17)

Clamps a number within the inclusive range specified by `min` and `max`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | The number to clamp. |
| `min` | `number` | The lower bound of the range. |
| `max` | `number` | The upper bound of the range. |

## Returns

`number`

The clamped value, which will be no less than `min` and no greater than `max`.

## Example

```typescript
clamp(5, 1, 10); // 5
clamp(-2, 0, 7); // 0
clamp(15, 0, 10); // 10
clamp(3, 3, 3); // 3
```

