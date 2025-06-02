const { ModuleFederationPlugin } = require("webpack").container;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { withZephyr } = require("zephyr-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  const baseConfig = {
    entry: "./src/index.ts",
    mode: argv.mode || "development",
    devServer: {
      port: 3000,
      open: true,
      historyApiFallback: true,
      hot: true,
    },
    output: {
      publicPath: "auto",
      clean: true,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react", "@babel/preset-typescript"],
            },
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "host",
        remotes: isProduction
          ? ["remotetodo"] // Zephyr production - array format
          : {
              // Development - localhost URLs
              remotetodo: "remotetodo@http://localhost:3001/remoteEntry.js",
            },
        shared: {
          react: { singleton: true },
          "react-dom": { singleton: true },
          "react-router-dom": { singleton: true },
        },
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "Module Federation Todo App",
      }),
    ],
  };

  return withZephyr()(baseConfig);
};
