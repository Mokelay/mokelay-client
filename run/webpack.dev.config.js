const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

const vuxLoader = require('vux-loader');

// fs.open('./src/env/env_config.js', 'w', function(err, fd) {
//     const buf = 'export default "local";';
//     fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
// });

var wc = merge(webpackBaseConfig, {
    devtool: '#source-map',
    output: {
        publicPath: '/run_dist/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    devServer: {
        historyApiFallback: true,
        contentBase: '.',
        inline: true,
        port: 8080,
        host: '0.0.0.0',
        disableHostCheck: true,
        compress: true,
        headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Credentials": true }
    },
    plugins: [
        // new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendors',
        //     filename: 'vendors.js'
        // }),
        // new HtmlWebpackPlugin({
        //     filename: '../index.html',
        //     template: './index.ejs',
        //     inject: false
        // }),
        new OpenBrowserPlugin({
            url: 'http://localhost:8080' //默认打开地址
        }),
    ]
});

module.exports = vuxLoader.merge(wc, {
    plugins: ['vux-ui']
});