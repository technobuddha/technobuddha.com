<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [JSON](./index.md) / TBJsonObject

# Type Alias: TBJsonObject

```ts
type TBJsonObject = { [Key in string]: TBJsonValue } & { [Key in string]?: TBJsonValue };
```

Defined in: [json.ts:14](https://github.com/technobuddha/library/blob/main/src/json.ts#L14)

Matches a JSON object.

This type can be useful to enforce some input to be JSON-compatible or as a super-type to be
extended from. Don't use this as a direct return type as the user would have to double-cast it:
`jsonObject as unknown as CustomResponse`. Instead, you could extend your CustomResponse type from
it to ensure your type only uses JSON-compatible types:
`interface CustomResponse extends TBJsonObject { … }`.

