const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const filename = (exp) => `[name].[contenthash].${exp ?? "[exp]"}`;
const src = (fp) => path.resolve(__dirname, `src/${fp ?? ""}`);


module.exports = {
  mode: "development",
  context: src(),
  entry: "./index.js",
  output: {
    filename: filename("js"),
    path: path.resolve(__dirname, "build"),
  },
  resolve: {
    extensions: [".js", ".json"],
    alias: {
      "@styles": src("assets/styles"),
      "@components": src("assets/components"),
      "@fonts": src("assets/fonts"),
      "@images": src("assets/images")
    },
  },
  devServer: {
    port: 3000,
    open: true,
    hot: true,
  },
  plugins: [
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      title: "Webpack Сборка",
      template: src("index.html"),
      minify: false,
    }),

    new MiniCssExtractPlugin({
      filename: filename("css"),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: src(),
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-env", { targets: "defaults" }],
                "@babel/preset-react",
              ],
            },
          },
        ],
      },
      {
        test: /\.(c|sc|sa)ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: {
          loader: "file-loader",
          options: {
            name: filename(),
            outputPath: "images",
          },
        },
      },
    ],
  },
};
