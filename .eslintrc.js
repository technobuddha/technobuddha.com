module.exports = {
    "root": true,
    "parser": "@typescript-eslint/parser",
    "plugins": [
      "@typescript-eslint",
      "react",
      "eslint-plugin-tsdoc",
      "eslint-plugin-react-hooks",
      "jsx-a11y",
      // TODO get the import pluging withing with tsconfig paths
      //"import",
      "jest",
      //"testing-library",
    ],
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:eslint-plugin-react-hooks/recommended",
      "plugin:jsx-a11y/recommended",
      //"plugin:import/errors",
      //"plugin:import/warnings",
      //"plugin:import/typescript",
      "plugin:jest/recommended",
      "plugin:testing-library/recommended",
    ],
    "settings": {
      "react": {
        "version": "detect",
      },
    //  // "import/parsers": {
    //  //   "@typescript-eslint/parser": [".ts", ".tsx"]
    //  // },
    //   "import/resolver": {
    //     // use <root>/tsconfig.json
    //     "typescript": {}
    //     //  "project": "./config/tsconfig.base.json"
    //     //}
    //   }
    },
    "env": {
      "browser": true,
      "amd": true,
      "node": true,
      "jest/globals": true,
    },
    "rules": {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-var-requires": "off",
      "react/display-name": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "off",
      //"import/no-unresolved": "error",
      "jsx-a11y/no-autofocus": "off",
    },
}