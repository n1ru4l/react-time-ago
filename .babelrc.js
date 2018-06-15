"use strict";

module.exports = {
  presets:
    process.env.NODE_ENV !== "build-flow"
      ? [
          [
            "@babel/preset-env",
            {
              targets: {
                browsers: "last 2 versions",
                node: "8"
              },
              modules: process.env.NODE_ENV === "test" ? undefined : false,
              loose: true
            }
          ]
        ]
      : [],
  plugins: ["@babel/plugin-transform-flow-strip-types"]
};
