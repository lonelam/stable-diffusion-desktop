const path = require('path');
/** @type {import('webpack').Configuration} */
module.exports = {
    entry: ['./src/main.ts'],
    target: 'electron-main',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.node$/,
                loader: 'node-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src/'),
        },
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'output'),
    },
    devtool: 'source-map',
};
