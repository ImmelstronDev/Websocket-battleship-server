import { resolve } from "node:path";

export default {
  mode: "production",
  entry: resolve(__dirname, "src", "index"),
  output: { clean: true, filename: "index.js" },
  module: { rules: [{ test: /\.ts$/i, loader: "ts-loader" }] },
  resolve: { extensions: [".ts", ".js"] },
  target: "node",
};
