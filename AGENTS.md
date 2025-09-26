<!---
  🚨
  🚨 CHANGES TO THIS FILE WILL BE OVERRIDDEN
  🚨
--->
# Agents

## Unit Testing

- All unit tests are run using Vitest.
- There is no need to import `describe`, `test`, or `expect` from "vitest", they are defined using tsconfig "types" field.
- Tests should be placed in the same folder next to the code being tested.
- Test files should be named with a `.test.ts` or `.test.tsx` suffix.
- Use a `describe` block to group tests for a specific functionality (e.g. function or class).  The describe block should be named after the functionality being tested.

## Documentation

- All Functions, Classes, Types, Interfaces and Constants are documented using [TypeDoc](https://typedoc.org/).
- Documentation should either include a @group and @category tag or be marked as @internal.
- Types and Interfaces document their properties as comments above the property definition. Not as a @property tag.
