const path = require("path")
const nodeExternals = require("webpack-node-externals")
const projectRoot = path.resolve(__dirname)

module.exports = {
  target: "node",
  mode: process.env.NODE_ENV,
  context: projectRoot,
  entry: {
    worker: "./app/worker.ts",
  },
  resolve: {
    modules: ["node_modules", projectRoot],
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.worker.json",
        },
      },
    ],
  },
}
