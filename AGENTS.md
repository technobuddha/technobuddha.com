<!-- markdown-lint-disable MD041
     🚨
     🚨 CHANGES TO THIS FILE WILL BE OVERRIDDEN
     🚨
-->
# Project Guidelines for AI Agents

This document provides guidelines for AI agents working on this codebase.

---

## Technobuddha Project

This project is part of the [Technobuddha](https://technobuddha.com) suite of open-source libraries and tools.

### Configuration

- The `@technobuddha/project` package manages configurations for:
  - TypeScript
  - ESLint
  - Prettier
  - Typedoc
  - Vitest
  - Cspell
  - VSCode
  - LICENSE
- Files marked with a header that includes "🚨" are managed and should not be modified directly.
- The TypeScript and ESLint configurations are dynamically generated based on the project structure.
- Other configurations are more static but may be updated in future versions of `@technobuddha/project`.
- All configurations can be updated by running the command `npx tb`. Note that this will overwrite any local changes to the configuration files, including ALL `tsconfig.json` files.
- If an error is found in a configuration, let the user know that `@technobuddha/project` needs to be updated.
- The file `technobuddha.config.js` at the root of the repository can be used to customize certain aspects of the generated configurations.

### Build

- This project is built using the `@technobuddha/project` build system.
- The build configuration is located in `builder.config.js` at the root of the repository.
- The build configuration consists of different "tasks" that can be run via `npx build <task>`.
- There are often aliases for common tasks in the package.json scripts section. `yarn build` will always run the full build task.

## Testing

### Framework and Setup

- **Test Framework**: Vitest
- **Test Globals**: `describe`, `test`, and `expect` are globally available via tsconfig "types" field (no imports needed)
- **Extended Matchers**:
  - `jest-extended` provides additional matchers
  - `jest-matcher-deep-close-to` for floating-point comparisons

### Test Organization

- **Location**: Place tests in `__tests__/` folder adjacent to the source code
- **Naming**: Use `.test.ts` or `.test.tsx` suffix for test files
- **Structure**: Wrap related tests in a `describe` block named after the functionality being tested
- **Import Order**: All imports (including test helpers and matchers) **must** appear at the very top of the test file, before any code, variables, or test definitions. This prevents test runner errors and ensures proper module resolution.

### Best Practices

- Prefer `toBeTrue()` and `toBeFalse()` over `toBe(true)` and `toBe(false)`

### Running Tests

```bash
yarn test                                              # Run all tests
yarn test --no-coverage path/to/test-file.test.ts     # Run specific test file without coverage
```

> **Note:** Always validate changes by running the targeted test files. Do not discuss test runner issues in user-facing responses; focus on actionable fixes and validation.

---

## Documentation

### General Requirements

- Use [TypeDoc](https://typedoc.org/) for all documentation
- Every exported Function, Class, Type, Interface, and Constant must have documentation
- All documentation must include `@group` and `@category` tags, OR be marked as `@internal`
- The `@group`, `@category`, and `@internal' must be the last tags in the comment block

### TypeDoc Tag Usage

#### Required Tags

- `@group` - High-level grouping (e.g., "String", "Array", "Phonetic")
- `@category` - More specific categorization within the group

#### Parameter Documentation

- Use `@param` for function parameters
- Use `@typeParam` (NOT `@template`) for type parameters

#### Return Values

- Use `@returns` to document what the function returns

#### Examples

- Use `@example` blocks with proper TypeScript code formatting
- Examples should demonstrate real-world usage patterns

### Property Documentation

**Types and Interfaces**: Document properties with inline comments above each property, NOT with `@property` tags.

```typescript
// ✅ Correct
export type Options = {
  /** Description of the flag */
  flag?: boolean;
};

// ❌ Incorrect
/**
 * @property flag - Description of the flag
 */
export type Options = {
  flag?: boolean;
};
```

### Function Overloads

**Multiple Call Signatures**:

- Include `@group` and `@category` tags ONLY on the implementation signature
- Document `@param` and `@returns` on call signatures, NOT on implementation
- Do not repeat descriptions across signatures
- TypeDoc shows implementation docs at the top, call signatures in a separate section below

**Destructured Parameters**: Use inline comments in the type definition rather than nested `@param` tags.

### Character Escaping

In TSDoc comments, escape these special characters:

- `<` → `\<`
- `>` → `\>`
- `\` → `\\`
- '{' → `\{`
- '}' → `\}`
- `@` → `\@`

### Documentation-Only Changes

When asked to "doc" or "document" code:

- **ONLY add or modify comments**
- **DO NOT change any code**
- **DO NOT remove eslint-disable comments**

---

## Code Standards

### Imports and Exports

- Always include file extensions in import and export statements.
- Never import from a directory; import from the `index.ts` explicitly.
- Use the `.ts` or `.tsx` extension.
- Use named exports only. Never use default exports.

**Example:**

```typescript
// ✅ Correct
import { myFunction } from './my-function.ts';
export { myFunction } from './my-function.ts';

// ❌ Incorrect
import { myFunction } from './my-function';
import myFunction from './my-function.ts'; // default export
```

### Naming Conventions

- Functions: camelCase
- Types and Interfaces: PascalCase
- Constants: UPPER_SNAKE_CASE or camelCase based on context.
- File names and directory names: kebab-case

### File Organization

- Group similar files together in directories
- For the most part, one main export per file (named after the file) with additional helper functions/types as needed
- Use `index.ts` files for re-exports within directories
- Place test files in `__tests__` directories adjacent to the source code.

### Type Safety

- **NEVER use `any`**
- Use specific types or `unknown` when the type is truly unknown
