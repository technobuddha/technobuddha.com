<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [RegExp](./index.md) / numeric

# Variable: numeric

```ts
const numeric: RegExp;
```

Defined in: [regexp.ts:163](https://github.com/technobuddha/library/blob/main/src/regexp.ts#L163)

Validate a valid number

## Example

```typescript
numeric.test('123'); // true
numeric.test('-123.45'); // true
numeric.test('1.23e4'); // true
numeric.test('Infinity'); // true
numeric.test('NaN'); // true
numeric.test('abc'); // false
numeric.test(''); // false
```

