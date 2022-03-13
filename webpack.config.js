const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/main.js',
    mode: 'development',
    target: 'web',
    watchOptions: {
        ignored: ['**/node_modules', './dist'],
        poll: 3000,
    },
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, 'assets'),
            publicPath: '/assets',
        },
        compress: true,
        port: 8080,
    },
    output: {
        filename: 'main.bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
        }),
    ],
}
