const { ModuleFederationPlugin } = require("webpack").container;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { withZephyr } = require("zephyr-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  // Use promise-based remotes for production to handle dynamic URLs
  const remotesConfig = isProduction
    ? {
        remotetodo: `promise new Promise(resolve => {
          const remoteName = 'remotetodo';
          const remoteUrl = 'https://pedro-henrique-85-remotetodo-original-remote-todo-d358dc977-ze.zephyrcloud.app/remoteEntry.js';
          
          const script = document.createElement('script');
          script.src = remoteUrl;
          script.onload = () => {
            const proxy = {
              get: (request) => window[remoteName].get(request),
              init: (arg) => {
                try {
                  return window[remoteName].init(arg);
                } catch(e) {
                  console.log('remote container already initialized');
                }
              }
            };
            resolve(proxy);
          };
          script.onerror = () => {
            console.error('Failed to load remote:', remoteUrl);
            // Fallback or error handling
            resolve({
              get: () => Promise.reject(new Error('Remote not available')),
              init: () => Promise.resolve()
            });
          };
          document.head.appendChild(script);
        })`,
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
