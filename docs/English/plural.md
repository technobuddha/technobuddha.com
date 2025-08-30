<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [English](./index.md) / plural

# Function: plural()

```ts
function plural(
   input: string, 
   quantity?: number, 
   include?: boolean): string;
```

Defined in: [plural.ts:21](https://github.com/technobuddha/library/blob/main/src/plural.ts#L21)

Return the plural version of the input string

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `input` | `string` | `undefined` | The word to pluralize |
| `quantity?` | `number` | `undefined` | The quantity to prepend to the word. If omitted nothing is prepended. If quantity is one the singular form is returned. |
| `include?` | `boolean` | `false` | If true and quantity is supplied, the quantity is prepended to the output. |

## Returns

`string`

The plural form of the input, or if a quantity is supplied - the quantity and the singular/plural form of the input (whichever is appropriate)

## Example

```typescript
plural('cat'); // cats
plural('mouse', 1); // mouse
plural('mouse', 2); // mice
plural('dog', 1, true); // 1 dog
plural('dog', 2, true); // 2 dogs
```

