<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [RegExp](./index.md) / isoDate

# Variable: isoDate

```ts
const isoDate: RegExp;
```

Defined in: [regexp.ts:146](https://github.com/technobuddha/library/blob/main/src/regexp.ts#L146)

Validate a ISO formatted date

## Example

```typescript
isoDate.test('2023-08-29T12:34:56Z'); // true
isoDate.test('2023-08-29T12:34:56.789+02:00'); // true
isoDate.test('2023-08-29T12:34'); // true
isoDate.test('2023-08-29'); // false
isoDate.test('not-a-date'); // false
```

