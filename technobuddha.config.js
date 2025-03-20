//@ts-check
// eslint-disable-next-line tsdoc/syntax
/** @type {import("@technobuddha/project").TechnobuddhaConfig} */
const config = {
  lint: {
    rules: {
      'technobuddha/optimize-imports': { rule: ['error', { alias: 'shortest' }], typescript: true },
      '@typescript-eslint/naming-convention': {
        doc: 'https://typescript-eslint.io/rules/naming-convention/',
        rule: [
          'error',
          {
            selector: 'default',
            format: ['camelCase'],
          },

          {
            selector: 'variable',
            format: ['camelCase'],
          },
          {
            selector: ['variable'],
            modifiers: ['const'],
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          },
          {
            selector: ['objectLiteralProperty'],
            modifiers: ['requiresQuotes'],
            format: null,
          },
          {
            selector: ['objectLiteralProperty'],
            format: ['camelCase', 'snake_case', 'PascalCase', 'UPPER_CASE'],
          },
          {
            selector: ['objectLiteralMethod'],
            format: ['camelCase'],
          },
          {
            selector: ['classicAccessor', 'autoAccessor'],
            format: ['camelCase'],
          },
          {
            selector: ['import'],
            format: ['camelCase', 'PascalCase'],
          },
          {
            selector: ['class'],
            format: ['PascalCase'],
          },
          {
            selector: ['classProperty'],
            format: ['camelCase'],
          },
          {
            selector: ['classProperty'],
            modifiers: ['readonly', 'static'],
            format: ['camelCase', 'UPPER_CASE'],
          },
          {
            selector: ['classMethod'],
            format: ['camelCase'],
          },
          {
            selector: ['interface', 'typeAlias'],
            format: ['PascalCase'],
          },
          {
            selector: ['typeMethod', 'typeProperty'],
            format: ['camelCase', 'snake_case'],
          },
          {
            selector: 'function',
            format: ['camelCase', 'PascalCase'],
          },
          {
            selector: ['typeParameter'],
            format: ['PascalCase'],
          },
          {
            selector: ['parameter'],
            format: ['camelCase'],
            leadingUnderscore: 'allow',
          },
          {
            selector: ['enum'],
            format: ['PascalCase'],
          },
          {
            selector: ['enumMember'],
            format: null,
          },
        ],
        typescript: true,
      },
    },
  },
  directories: {
    'src': {
      environment: 'browser',
    },
    'src/client': {
      environment: 'browser',
      tsconfig: {
        references: ['src/settings'],
      },
    },
  },
};

export default config;
