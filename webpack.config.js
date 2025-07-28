const path = require("path");
const myWebpackPlugin = require("./my-webpack-plugin");

module.exports = { // 노드의 모듈 시스템
    mode: "development",
    entry: {
        main: "./src/app.js"
    },
    output: {
        path: path.resolve('./dist'),
        filename: "[name].js"
    },
    plugins: [
        new myWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: "./my-webpack-loader",
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                    }
                ]
            },
            {
                test: /\.png|jpg|jpeg|gif|svc$/,
                loader: 'url-loader',
                options: {
                    publicPath: './dist/',
                    name: '[name].[ext]?[hash]',
                    limit: 20000, // 2kb -> 2kb 미만의 것들을 url-loader 가 실행할 수 있게 처리, 그 이상은 file-loader 로 실행
                }
            }
        ]
    }
}