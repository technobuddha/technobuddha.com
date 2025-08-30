<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [RegExp](./index.md) / ipV4

# Variable: ipV4

```ts
const ipV4: RegExp;
```

Defined in: [regexp.ts:25](https://github.com/technobuddha/library/blob/main/src/regexp.ts#L25)

validate an IPv4 address

## Example

```typescript
ipV4.test('192.168.1.1'); // true
ipV4.test('255.255.255.255'); // true
ipV4.test('256.0.0.1'); // false
ipV4.test('abc.def.ghi.jkl'); // false
```

