<!-- markdownlint-disable -->
<!-- cspell: disable -->
[Library](../index.md) / [Programming](./index.md) / graphQL

# Function: graphQL()

Tagged template function for constructing GraphQL queries or mutations.

## Call Signature

```ts
function graphQL(template: TemplateStringsArray, ...args: GraphQLValue[]): string;
```

Defined in: [graph-ql.ts:44](https://github.com/technobuddha/library/blob/main/src/graph-ql.ts#L44)

Escapes and formats GraphQL query strings or values.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `template` | `TemplateStringsArray` | The template string array representing the static parts of the GraphQL query. |
| ...`args` | [`GraphQLValue`](GraphQLValue.md)[] | The dynamic values to interpolate into the query. |

### Returns

`string`

The resulting GraphQL query string with interpolated values.

### Example

```typescript
const userId = 123;
const query = graphQL`
  query GetUser { user(id: ${userId}) { id name } }
`;
// query: 'query GetUser { user(id: 123) { id name } }'
```

## Call Signature

```ts
function graphQL(arg: GraphQLValue): string;
```

Defined in: [src/graph-ql.ts:57](https://github.com/technobuddha/library/blob/main/src/graph-ql.ts#L57)

Escape and format an individual GraphQL query string.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `arg` | [`GraphQLValue`](GraphQLValue.md) | The dynamic value to interpolate into the query. |

### Returns

`string`

The resulting GraphQL query string with interpolated values.

### Example

```typescript
// Using as a function
graphQL('hello'); // '"hello"'
graphQL(42); // '42'
graphQL({ foo: 'bar' }); // '{foo:"bar"}'
```

