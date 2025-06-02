const { ModuleFederationPlugin } = require("webpack").container;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { withZephyr } = require("zephyr-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  const remotesConfig = isProduction
    ? {
        remotetodo:
          "remotetodo@https://pedro-henrique-75-remotetodo-original-remote-todo-d358dc977-ze.zephyrcloud.app/remoteEntry.js",
      }
    : {
        remotetodo: "remotetodo@http://localhost:3001/remoteEntry.js",
      };

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
        remotes: remotesConfig,
        shared: {
          react: {
            singleton: true,
            requiredVersion: "^18.2.0",
          },
          "react-dom": {
            singleton: true,
            requiredVersion: "^18.2.0",
          },
          "react-router-dom": {
            singleton: true,
            requiredVersion: "^6.30.1",
          },
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
