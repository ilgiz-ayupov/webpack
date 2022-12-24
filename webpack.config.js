const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const filename = (ext) => `[name].[contenthash].${ext ?? "[ext]"}`;
const src = (fp) => path.resolve(__dirname, `src/${fp ?? ""}`);
const build = (fp) => path.resolve(__dirname, `build/${fp ?? ""}`);

module.exports = {
  mode: "development",
  entry: src("index.js"),
  output: {
    filename: filename("js"),
    path: build(),
  },
  resolve: {
    extensions: [".js", ".json"],
    alias: {
      "@styles": src("assets/styles"),
      "@components": src("assets/components"),
      "@fonts": src("assets/fonts"),
      "@images": src("assets/images"),
    },
  },
  devServer: {
    watchFiles: src(),
    port: 3000,
    hot: true,
  },
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              ["svgo", { name: "preset-default" }],
            ],
          },
        },
      }),
    ],
  },
  plugins: [
    new FileManagerPlugin({
      events: {
        onStart: {
          delete: [build()],
        },
        onEnd: {
          copy: [{ source: src("static"), destination: build() }],
        },
      },
    }),

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
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: path.join("assets/images", filename()),
        },
      },
      {
        test: /\.svg$/,
        type: "asset/resource",
        generator: {
          filename: path.join("assets/icons", filename()),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
};
