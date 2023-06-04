const path = require('path');
const webpackConfig = require('./webpack.config');
/** @type {import('webpack').Configuration} */
module.exports = {
    ...webpackConfig,
    entry: ['./src/preload.ts'],
    target: 'electron-preload',
    output: {
        filename: 'preload.js',
        path: path.resolve(__dirname, 'output'),
    },
};
