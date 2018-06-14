module.exports = {
  presets: [
    [
      `@babel/preset-env`,
      {
        targets: {
          browsers: `last 2 versions`,
          node: `8`,
        },
        modules: process.env.NODE_ENV === `test` ? undefined : false,
      },
    ],
  ],
  plugins: [`@babel/plugin-transform-flow-strip-types`],
}
