var path = require('path');
var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
/*extract-text-webpack-plugin将你的样式提取到单独的css文件里，*/
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// 清理 dist 文件夹
const CleanWebpackPlugin = require("clean-webpack-plugin");
const config = require('./config/config');
let HTMLPlugins = [];
// 入口文件集合
let Entries = {};
// 生成多页面的集合
config.entrys.forEach((page) => {
    let htmlPlugin = new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
        favicon: config.favicon, //favicon路径，通过webpack引入同时可以生成hash值
        filename: page.filename, //生成的html存放路径，相对于path
        template: page.template, //html模板路径
        title: page.title,
        inject: true, //js插入的位置，true/'head'/'body'/false
        hash: true, //为静态资源生成hash值
        chunks: [config.commonname, page.name],//需要引入的chunk，不配置就会引入所有页面的资源
        minify: { //压缩HTML文件
            removeComments: true, //移除HTML中的注释
            collapseWhitespace: false //删除空白符与换行符
        }
    });

HTMLPlugins.push(htmlPlugin);
Entries[page.name] = page.entry;
});
const chunks = Object.keys(Entries);
module.exports = {
    entry: Entries,
    output: {
        path: __dirname + '/dist', //输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
        filename: 'js/[name].js',     //每个页面对应的主js的生成配置
        chunkFilename: 'js/[id].chunk.js'   //chunk生成的配置
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: config.commonname, // 将公共模块提取，生成名为指定的chunk
            chunks: chunks, //提取哪些模块共有的部分
            minChunks: chunks.length // 提取至少全部模块共有的部分
        }),
        new CleanWebpackPlugin(["dist"]),
        new ExtractTextPlugin(config.cssOutPath + '/[name].css'), //单独使用link标签加载css并设置路径，相对于output配置中的publickPath
        ...HTMLPlugins,
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),
    /*new webpack.ProvidePlugin({
      flvjs: 'flv.js'
    }),*/
    new CopyWebpackPlugin([{
        from: __dirname + '/src/assets',
        to: './assets'
    }]),
    new webpack.HotModuleReplacementPlugin()
],
resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js']
},
module: {
    loaders: [
        /*{ test: /\.ts$/, loader: 'ts-loader' },*/
        {test: /\.ts$/, loader: 'awesome-typescript-loader'},
        {
            test: /\.html$/,
            loader: "html-loader?attrs=img:src img:data-src"
        },
        {
            test: /\.scss|sass$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                publicPath: config.cssPublicPath,
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            minimize: true
                        }
                    }
                ]
            })
        }, {
            test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    // use HASH file name for 'production
                    name: '[name].[ext]',
                    limit: 8192,
                    outputPath: config.fontsOutPath,
                    // publicPath: 'images/',
                }
            }],
        }, {
            test: /\.(png|jpg|gif)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    // use HASH file name for 'production
                    limit: 8192,
                    name: '[hash].[ext]',
                    outputPath: config.imageOutPath,
                    // publicPath: 'images/',
                }
            }]
        }
    ]
},
//webpack-dev-server
devServer: {
    contentBase: '/',
        host: config.dev_host,
        port: config.dev_port, //默认8080
        inline: true //可以监控js变化
}
};