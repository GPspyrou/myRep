// functions/.eslintrc.cjs
module.exports = {
  root: true,           // <- stops ESLint crawling up into your Next.js app
  env: {
    node: true,
    es2020: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  ignorePatterns: [
    "node_modules/",
  ],
  rules: {
    // e.g.:
    // "no-console": "warn",
  },
};
