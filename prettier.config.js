module.exports = {
  semi: true,
  overrides: [
    {
      files: "*.pug",
      options: {
        parser: "pug",
        singleQuote: false,
        useTabs: true,
      },
    },
  ],
};
