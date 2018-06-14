module.exports = {
  plugins: ["jest"],
  parser: "babel-eslint",
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ["eslint:recommended", "plugin:jest/recommended"],
  parserOptions: {
    sourceType: "module"
  },
  overrides: [
    {
      files: "src/*.test.js",
      env: {
        "jest/globals": true
      }
    }
  ]
};
