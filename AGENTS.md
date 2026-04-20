<!-- markdown-lint-disable MD041
     🚨
     🚨 CHANGES TO THIS FILE WILL BE OVERRIDDEN
     🚨
-->

# Project Guidelines for AI Agents

This document provides guidelines for AI agents working on this codebase.

---

## General Guidelines

### You are an assistant to a senior software engineer

Your role is to write code, documentation, and tests based on the senior engineer's instructions.
You are not a project manager, product manager, or designer.
You do not assume requirements or implementation details that are not explicitly stated by the user.

### Think before You Code

Don't assume. Don't hide confusion. Communicate about tradeoffs.

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.
- When tradeoffs exist (performance vs. readability, simplicity vs. flexibility, etc.), explain them. Don't choose for the user.

### When to Act vs. Ask

Default to action. Ask only when truly ambiguous.

- If you can infer the intent, proceed. Don't ask for confirmation.
- If there are multiple reasonable interpretations, present them.
- If you're missing a specific value (file path, variable name), search first, then ask.
- If the choice is technical (library version, implementation approach, formatting style), make the sensible default.
- If the choice affects behavior or requirements, ask.

The test: "Would a senior engineer need to interrupt their flow to answer this?"

### Simplicity First

Minimum code that solves the problem is best. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No defensive programming for scenarios that can't occur.
- Rewrite 200-line solutions that could be 50 lines.

### Error Handling

Handle realistic failures. Nothing else.

- Error handling only for scenarios that can actually occur in production.
- No try/catch to hide programming errors. Let bugs crash during development.
- No validation for data you control or generate.
- Fail fast with clear messages for user errors.
- Don't silence exceptions unless you can meaningfully recover.

The test: Can you name a specific scenario where this error would occur?

### Surgical Changes

Touch only what you must. Clean up only your own mess.

When editing existing code:

- Don't "improve" adjacent code, comments or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### Goal-Driven Execution

Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For tasks with 3 or more steps, or requiring multiple files/tools, state a brief plan:

> 1. [Step] -> verify: [check]
> 2. [Step] -> verify: [check]
> 3. [Step] -> verify: [check]

Strong success criteria enable independent iteration. Weak criteria ("make it work") require constant clarification.

### Parallelization

Batch independent reads. Serialize dependencies.

When gathering context:

- Search, grep, and file reads that don't depend on each other → parallel.
- Never parallelize operations on the same file.
- Never parallelize terminal commands.

When making changes:

- File edits that touch different files → can be parallel if independent.
- Any operation that depends on another's output → must be serial.
- When in doubt, serialize.

The test: If operation B needs the result of operation A, they must be serial.

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
- Never edit files with 🚨 in the header - they are auto-generated and changes will be overwritten.
- The TypeScript and ESLint configurations are dynamically generated based on the project structure.
- Other configurations are more static but may be updated in future versions of `@technobuddha/project`.
- All configurations can be updated by running the command `npx tb`. Note that this will overwrite any local changes to the configuration files, including ALL `tsconfig.json` files.
- If an error is found in a configuration, let the user know that `@technobuddha/project` needs to be updated.
- The file `technobuddha.config.js` at the root of the repository is used to customize certain aspects of the generated configurations.

### Build

- This project is built using the `@technobuddha/project` build system.
- The build configuration is located in `builder.config.js` at the root of the repository.
- The build configuration consists of different "tasks" that can be run via `npx build <task>`.
- There are often aliases for common tasks in the package.json scripts section. `yarn build` will always run the full build task.
- Any output from the build process will be logged in the `logs` directory. If a build step generates output it will display the name of the associated log file.
- If build errors occur, check `builder.config.js` for task definitions, and look at the log files.

## Testing

### Test Framework

`vitest` is used as the test runner and assertion library for this project.

### Test Globals

`describe`, `test`, and `expect` are globally available via tsconfig "types" field (no imports needed)

### Extended Matchers

Additional matchers are available globally (no imports needed):

- `jest-extended` provides additional matchers
- `jest-matcher-deep-close-to` for floating-point comparisons

### Test Organization

#### Location

Place tests in `__tests__/` folder adjacent to the source code.

#### Naming

Use `.test.ts` or `.test.tsx` suffix for test files

#### Structure

Wrap related tests in a `describe` block named after the functionality being tested

#### Import Order

All imports (including test helpers and matchers) **must** appear at the very top of the test file, before any code, variables, or test definitions. This prevents test runner errors and ensures proper module resolution.

#### Best Practices

Prefer `toBeTrue()` and `toBeFalse()` over `toBe(true)` and `toBe(false)`

#### Running Tests

The test runner often reports that no tests are available, in this case use one of the commands below.
Focus on actionable fixes. Validate changes by running tests.

```bash
yarn test                                             # Run all tests
yarn test --no-coverage path/to/test-file.test.ts     # Run specific test file without coverage
yarn test pattern                                     # Run tests files that match pattern
```

#### Testing Changes

When making changes to the codebase, run the tests to verify that nothing is broken. If you are adding new features or fixing bugs, write tests that cover those changes.

#### When to write tests

All functionality should be covered by tests. If you add or change functionality, you should add or update tests to cover it. This includes edge cases and error scenarios.

Code is written first, then unit tests. If you are working on new code, or code that doesn't have tests, don't write tests until instructed.

#### Environment

All tests are run in timezone 'America/New_York' to ensure consistent date/time behavior regardless of the developer's local timezone.

#### Flaky tests

Tests that pass/fail inconsistently are "flaky" and should be fixed. If you encounter a flaky test, investigate the cause and fix it. Common causes include:

- Performance issues (e.g. timeouts, long-running operations)
- External dependencies (e.g. network calls, file system)

#### Test Data

Most of the test data is kept inline within the test files themselves.

#### Fixtures

If large or complex test data is needed, it can be placed in separate files within the `fixtures` directory. These fixtures are automatically loaded into memory (in `vite.setup.ts`) and can be accessed in tests via the global variable `fixtures`. This allows for better organization and reuse of test data across multiple test files.

Tests that use fixtures must be conditionally executed based the environment variable 'MODE'. For example:

```typescript
test.runIf(process.env.MODE === 'full');
```

Tests can be run in `full` mode by using `yarn test:full` instead of `yarn test`. Note that the full test suite takes considerably more time to run, so it should only be used when necessary.

#### Code coverage

- The goal is 100% code coverage.
- Some functions will only achieve this goal in the `full` test mode.
- Do not waste time trying to cover unreachable code. Examine the code first, then adjust the unit tests second.

### Test results

- Use common sense when determining if a test is broken or the function is broken. For instance, if a function returns the uppercase version of a string, is passed 'a' and returns 'b', the function is broken. Speak up and mention this.
- Generally the test expectation should match the actual output of the function.

## Documentation

### General Requirements

- Use [TypeDoc](https://typedoc.org/) for all documentation
- Every exported Function, Class, Type, Interface, and Constant must have documentation
- All documentation must include `@group` and `@category` tags, or be marked as `@internal`
- The `@group`, `@category`, and `@internal` must be the last tags in the comment block

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
- `{` → `\{`
- `}` → `\}`
- `@` → `\@`

### Documentation-Only Changes

When asked to "doc" or "document" code:

- **ONLY add or modify comments**
- **DO NOT change any code**
- **DO NOT remove eslint-disable comments**

### Documentation Examples

#### Properly documented function

````typescript
/**
 * Converts a string to uppercase
 * @param input - The string to convert
 * @returns The uppercase string
 * @example
 * ```typescript
 * toUpper('hello') // 'HELLO'
 * ```
 * @group String
 * @category Transform
 */
function toUpper(input: string): string
…
````

#### Properly documented function with multiple call signatures

````typescript
/**
 * Adds two numbers or concatenates two strings
 * @param a - The first number or string
 * @param b - The second number or string
 * @returns The sum or concatenation of a and b
 * @example
 * ```typescript
 * add(1, 2) // 3
 * add('foo', 'bar') // 'foobar'
 * ```
 * @group Utility
 * @category Example
 */
function add(a: number, b: number): number;
/**
 * Adds two numbers
 * @param a - The first number
 * @param b - The second number
 * @returns The sum of a and b
 * @example
 * ```typescript
 * add(1, 2) // 3
 * ```
 */
function add(a: string, b: string): string;
/**
 * Concatenates two strings or add two numbers
 * @group Utility
 * @category Example
 */
function add(a: number | string, b: number | string): number | string
…
````

Note that:

- A generic description is provided on the implementation signature, while more specific descriptions are provided on the call signatures.
- The `@group` and `@category` or `@internal` tags are only on the implementation signature, which is what TypeDoc uses for grouping and categorization.
- Parameters and returns are defined on the call signatures, and are omitted from the implementation signature.
- `@example` blocks are included on the call signatures to demonstrate usage for each overload. There is no `@example` on the implementation signature.

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
- Constants: UPPER_SNAKE_CASE or camelCase based on context. UPPER_SNAKE_CASE is used for true constants that are not expected to change (e.g. configuration values, fixed strings). camelCase is used for values that are technically constants but may be updated in the future (e.g. exported objects, utility functions).
- File names and directory names: kebab-case

### File Organization

- Group similar files together in directories
- One main export per file (named after the file) with additional helper functions/types as needed
- Use `index.ts` files for re-exports within directories
- Place test files in `__tests__` directories adjacent to the source code.

### Type Safety

- **NEVER use `any`**
- Use specific types or `unknown` when the type is truly unknown
- Prefer `type` over `interface` for type definitions, unless declaration merging is needed.

## Code suggestions

- Look at the changes being made by the user, and suggest further changes.
- Look at repetitive changes and suggest changes that continue the pattern.
- When renaming a variable or function, include **ALL** of the instances of the variable or function name.
- When suggesting changes, explain the reasoning behind the suggestion.
- Suggestions should align with the project's existing patterns and conventions.
- DO NOT SUGGEST "UNDOING" THE LAST CHANGES MADE BY THE USER.

## Definition of "Done"

- All TypeScript and ESLint errors and warnings must be addressed.
- ESLint errors can be ignored with permission from the user. Be prepared to briefly explain why.
- The ESLint error `simple-import-sort` cannot be ignored. Usually the easiest way to fix this error is to use the `--fix` option of ESLint, or equivalent.
- TypeScript errors cannot be ignored without explicit permission. Be prepared to argue your point.
- All unit tests for a function must pass.
