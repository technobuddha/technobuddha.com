<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / toDegrees

# Function: toDegrees()

```ts
function toDegrees(angle: number, options: UnitOptions): number;
```

Defined in: [to-degrees.ts:16](https://github.com/technobuddha/library/blob/main/src/to-degrees.ts#L16)

Convert an angle from radians to degrees

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `angle` | `number` | Angle |
| `options` | [`UnitOptions`](UnitOptions.md) | see [UnitOptions](UnitOptions.md) |

## Returns

`number`

angle in degrees

## Example

```typescript
toDegrees(Math.PI); // 180
toDegrees(1, 'turns'); // 360
```

