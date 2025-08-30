<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [RegExp](./index.md) / email

# Variable: email

```ts
const email: RegExp;
```

Defined in: [regexp.ts:226](https://github.com/technobuddha/library/blob/main/src/regexp.ts#L226)

validate an valid email address

## Example

```typescript
email.test('user@example.com'); // true
email.test('user@sub.example.co'); // true
email.test('invalid@domain'); // false
email.test('not-an-email'); // false
```

