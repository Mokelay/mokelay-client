const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const vuxLoader = require('vux-loader');

var env = process.env.ENV || "local";

const OpenBrowserPlugin = require('open-browser-webpack-plugin');

fs.open('./run/src/env/env_config.js', 'w', function(err, fd) {
    const buf = 'export default "' + env + '";';
    fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
});

const envInfo = require('./src/env/env_h5_host.js');
const h5Host = envInfo[env]['h5Host']; //静态资源从静态服务器上取
console.log('TY CLIENT HOST=======' + h5Host);

var wc = null;

if (env == "local") {
    wc = merge(webpackBaseConfig, {
        devtool: '#source-map',
        output: {
            publicPath: h5Host,
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
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            }
        },
        plugins: [
            // new webpack.HotModuleReplacementPlugin(),
            new ExtractTextPlugin({
                filename: '[name].css',
                allChunks: true
            }),
            new OpenBrowserPlugin({
                url: 'http://localhost:8080' //默认打开地址
            }),
        ]
    });
} else if (env == "prd") {
    wc = merge(webpackBaseConfig, {
        output: {
            publicPath: h5Host,
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
            new HtmlWebpackPlugin({
                filename: '../index_' + env + '.html',
                template: './run/index.ejs',
                inject: false
            }),
            new HtmlWebpackPlugin({
                filename: './hash.html',
                template: './run/hash.ejs',
                inject: false
            }),
            new ManifestPlugin()
        ]
    });
}

module.exports = vuxLoader.merge(wc, {
    plugins: ['vux-ui']
});