<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Geometry](./index.md) / LargestInscribedRectUnitOptions

# Type Alias: LargestInscribedRectUnitOptions

```ts
type LargestInscribedRectUnitOptions = {
  aligned?: boolean;
  squareOnly?: boolean;
};
```

Defined in: [largest-inscribed-rectangle.ts:29](https://github.com/technobuddha/library/blob/main/src/largest-inscribed-rectangle.ts#L29)

Configuration options for the largest inscribed rectangle algorithm.

## Properties

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="aligned"></a> `aligned?` | `boolean` | `true` | If true, only consider axis-aligned rectangles. If false, considers rectangles at all orientations. | [src/largest-inscribed-rectangle.ts:35](https://github.com/technobuddha/library/blob/main/src/largest-inscribed-rectangle.ts#L35) |
| <a id="squareonly"></a> `squareOnly?` | `boolean` | `false` | If true, only consider squares (rectangles where width equals height). If false, considers rectangles of any aspect ratio. | [src/largest-inscribed-rectangle.ts:42](https://github.com/technobuddha/library/blob/main/src/largest-inscribed-rectangle.ts#L42) |

