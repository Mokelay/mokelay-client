const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const vuxLoader = require('vux-loader');

// console.log(process.env.NODE_ENV);
var env = process.env.ENV;

// fs.open('./src/env/env_config.js', 'w', function(err, fd) {
//     const buf = 'export default "' + env + '";';
//     fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
// });

// const envInfo = require('./src/env/env.js');
// const h5Host = envInfo[env]['h5Host']; //静态资源从静态服务器上取
// console.log('p-ty=======' + h5Host);

var wc = merge(webpackBaseConfig, {
    output: {
        //TODO publicpath要做成可配置
        publicPath: 'http://greatbee-ty.oss-cn-hangzhou.aliyuncs.com/run_dist/',
        // publicPath: '/run_dist/',
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].chunk.js'
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].[chunkhash].css',
            allChunks: true
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendors',
        //     filename: 'vendors.[hash].js'
        // }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"prd"'
            }
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // }),
        new UglifyJsPlugin(),
        // new HtmlWebpackPlugin({
        //     filename: '../index_' + env + '.html',
        //     template: './index.ejs',
        //     inject: false
        // }),
        // new HtmlWebpackPlugin({
        //     filename: '../dist/hash.html',
        //     template: './hash.ejs',
        //     inject: false
        // })
    ]
});

module.exports = vuxLoader.merge(wc, {
    plugins: ['vux-ui']
});