module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "airbnb-base",
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "import/no-unresolved": "off",
    "import/extensions": ["warn", "never"],
    "import/prefer-default-export": "off",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
};
