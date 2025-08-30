<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / angleReflection

# Function: angleReflection()

```ts
function angleReflection(
   angle: number, 
   axis: number, 
   options: UnitOptions): number;
```

Defined in: [angle-reflection.ts:20](https://github.com/technobuddha/library/blob/main/src/angle-reflection.ts#L20)

Calculates the reflection of an angle across a specified axis.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `angle` | `number` | The angle to reflect. |
| `axis` | `number` | The axis across which to reflect the angle. |
| `options` | [`UnitOptions`](UnitOptions.md) | see [UnitOptions](UnitOptions.md) |

## Returns

`number`

The reflected angle, in the specified units.

## Example

```typescript
angleReflection(0, Math.PI / 2); // π
angleReflection((3 * Math.PI) / 2, Math.PI); // π/2
angleReflection(60, 30, 'degrees'); // 0
```

