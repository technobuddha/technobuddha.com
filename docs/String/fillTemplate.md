<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [String](./index.md) / fillTemplate

# Function: fillTemplate()

```ts
function fillTemplate(
   input: string, 
   values: Record<string, string | undefined>, 
   options: FillTemplateOptions): string;
```

Defined in: [fill-template.ts:25](https://github.com/technobuddha/library/blob/main/src/fill-template.ts#L25)

Fill a template with supplied values

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The template |
| `values` | [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `string` \| `undefined`\> | A dictionary of name-values used to fill in values in the template |
| `options` | [`FillTemplateOptions`](FillTemplateOptions.md) | see [FillTemplateOptions](FillTemplateOptions.md) |

## Returns

`string`

template with values replaced

## Default Value

```ts
open '{{'
```

## Default Value

```ts
close '}}'
```

