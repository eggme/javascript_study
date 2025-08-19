const path = require("path");
const myWebpackPlugin = require("./my-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
        new HtmlWebpackPlugin({
            template: "./dist/index.html", // 기본 HTML 템플릿
        }),
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
    },
    devServer: {
        static: {
            directory : path.join(__dirname, "dist"), // 정적 파일을 제공할 경로, 기본은 웹팩 아웃풋임
        },
        // host: "dev.domain.com", // 개발환경에서 도메인을 맞추어야 하는 상황에서 사용,
        devMiddleware: { // webpack dev server 4 이상에서는 devMiddleware 에 넣어야함
            stats: "errors-only", // 메세지 수준을 정할 수 있음  'none', 'errors-only', 'minimal', 'normal', 'verbose'
            publicPath: "/", // 브라우저를 통해 접근하는 경로, 기본은 '/'임
        },
        client: {
            overlay: {
                warnings: true,
                errors: true
            }, // 빌드시 에러나 경고를 브라우저에 표현
        },
        hot: true, // hot Module Replacement
        port: 3000,
        //historyApiFallBack: true, // 히스토리 API를 사용하는 SPA 개발시 설정한다. 404가 발생하면 index.html로 리다이렉트한다.
        open: true, // 브라우저 자동 열기
        setupMiddlewares: (middlewares, devServer) => {
            devServer.app.get("/api/users", (req, res) => {
                res.json([
                    { id: 1, name: "Alice" },
                    { id: 2, name : "Bek" },
                    { id: 3, name: "Kei"}
                ])
            })
            return middlewares;
        },
    },
}