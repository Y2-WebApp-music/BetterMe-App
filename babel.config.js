module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" },"@react-native/babel-preset",],
      "nativewind/babel",
    ],
  };
};
