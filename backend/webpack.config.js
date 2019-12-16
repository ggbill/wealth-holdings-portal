const fs = require("fs");
const path = require("path");
const NodemonPlugin = require("nodemon-webpack-plugin");
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');

const nodeModules = {};
fs.readdirSync("node_modules")
    .filter(function (x) {
        return [".bin"].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = "commonjs " + mod;
    });

module.exports = {
    //   entry: "./server/server.ts",
    entry: "./main.ts",
    output: {
        path: path.join(__dirname, "/build"),
        filename: "server.js",
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
        ],
    },
    target: "node",
    externals: nodeModules,
    plugins: [
        new NodemonPlugin(),
        new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.7
        }),
        new BrotliPlugin({
            asset: '[path].br[query]',
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.7
        })
    ],
};
