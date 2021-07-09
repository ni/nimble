const CircularDependencyPlugin = require("circular-dependency-plugin");

module.exports = {
  core: {
    builder: "webpack5"
  },
  stories: ["../src/**/*.stories.ts"],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.ts$/,
      use: [
        {
          loader: require.resolve("ts-loader")
        }
      ]
    });
    config.plugins.push(
      new CircularDependencyPlugin({
        exclude: /node_modules/,
        failOnError: process.env.NODE_ENV === "production"
      })
    );

    return config;
  }
};
