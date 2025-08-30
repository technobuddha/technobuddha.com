<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / angleDifference

# Function: angleDifference()

```ts
function angleDifference(
   startAngle: number, 
   endAngle: number, 
   options: UnitOptions): number;
```

Defined in: [angle-difference.ts:25](https://github.com/technobuddha/library/blob/main/src/angle-difference.ts#L25)

Computes the difference between startAngle and endAngle.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `startAngle` | `number` | Start angle. |
| `endAngle` | `number` | End angle. |
| `options` | [`UnitOptions`](UnitOptions.md) | see [UnitOptions](UnitOptions.md) |

## Returns

`number`

The amount that when added to *startAngle* will result in *endAngle*.

## Remarks

Positive numbers mean that the
direction is clockwise. Negative numbers indicate a counter-clockwise direction.
The shortest route (clockwise vs counter-clockwise) between the angles is used.
When the difference is π radians, the function returns π (not -π)

## Example

```typescript
angleDifference(Math.PI * 1/6, Math.PI * 2/6); // π * 1/6
angleDifference(Math.PI * 2/6, Math.PI * 1/6); // -π * 1/6.
angleDifference(30, 60, 'deg'); // 30
```

