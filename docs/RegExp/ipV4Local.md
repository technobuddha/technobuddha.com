<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [RegExp](./index.md) / ipV4Local

# Variable: ipV4Local

```ts
const ipV4Local: RegExp;
```

Defined in: [regexp.ts:58](https://github.com/technobuddha/library/blob/main/src/regexp.ts#L58)

determine if Ipv4 address is local

## Example

```typescript
ipV4Local.test('192.168.1.1'); // true
ipV4Local.test('10.0.0.1'); // true
ipV4Local.test('172.16.0.1'); // true
ipV4Local.test('8.8.8.8'); // false
ipV4Local.test('256.0.0.1'); // false
```

