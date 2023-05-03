const webpack = require("webpack");

module.exports = function override(config, env) {
  const loaders = config.resolve;

  loaders.fallback = {
    path: require.resolve("path-browserify"),
    os: require.resolve("os-browserify"),
    url: require.resolve("url"),
    assert: require.resolve("assert"),
    stream: require.resolve("stream-browserify"),
    crypto: require.resolve("crypto-browserify"),
    buffer: require.resolve("buffer"),
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
      buffer: "buffer/",
    })
  );

  return config;
};
