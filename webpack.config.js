const DEBUG = process.env.NODE_ENV !== 'production';

const rimraf            = require('rimraf');
const path              = require('path');
const webpack           = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

let webpackConfig = {
    context: __dirname + '/frontend',
    output : {
        path      : path.resolve(__dirname, 'public/app'),
        filename  : '[name].js',
        publicPath: '/public/'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules   : [
            path.resolve(__dirname),
            'node_modules'
        ]
    },
    module : {
        loaders: [
            {
                test   : /\.jsx?$/,
                exclude: [/node_modules/],
                loader : 'babel-loader',
                query  : {
                    presets: ['es2015', 'react'],
                    plugins: ['transform-decorators-legacy', 'transform-class-properties', 'transform-object-rest-spread']
                }
            },
            {
                test  : /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use     : [
                        {
                            loader : 'css-loader',
                            options: {
                                sourceMap: DEBUG,
                                minimize : !DEBUG
                            }
                        },
                        {
                            loader: 'postcss-loader', options: {
                                sourceMap: DEBUG
                            }
                        }
                    ]
                })
            },
            {
                test: /\.scss$/,
                use : ['css-hot-loader'].concat(ExtractTextPlugin.extract(
                    {
                        fallback: 'style-loader',
                        use     : [
                            {
                                loader : 'css-loader',
                                options: {
                                    sourceMap     : DEBUG,
                                    minimize      : !DEBUG,
                                    importLoaders : 1,
                                    modules       : true,
                                    localIdentName: DEBUG ? '[local]--[hash:8]' : '[hash:base64]',
                                    context: __dirname
                                }
                            },
                            {
                                loader: 'resolve-url-loader'
                            },
                            {
                                loader : 'postcss-loader',
                                options: {
                                    sourceMap: DEBUG
                                }
                            },
                            {
                                loader : 'sass-loader',
                                options: {
                                    sourceMap   : DEBUG,
                                    includePaths: [path.resolve(__dirname, 'frontend', 'css')]
                                }
                            }
                        ]
                    }
                ))
            },
            {
                test  : /\.woff2?$|\.ttf$|\.eot$|\.svg$|\.png|\.jpe?g|\.gif$/,
                loader: 'file-loader?name=[path][name].[ext]'
            },
            {
                test  : /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].css'),
        new webpack.optimize.CommonsChunkPlugin({
            name     : 'common',
            minChunks: function (module, count) {

                if (
                    module.context
                    && (
                        module.context.indexOf('node_modules') !== -1
                        || module.context.indexOf('modules') !== -1
                        || module.context.indexOf('common') !== -1
                        || module.context.indexOf('css') !== -1
                        || module.resource && module.resource.indexOf('localization.json') !== -1
                    )
                ) {
                    return true;
                }
            }
        }),
        { apply: (compiller) => rimraf.sync(compiller.options.output.path) }
    ],
    cache  : false
};

if (DEBUG) {
    webpackConfig.devtool = 'source-map';

    webpackConfig.entry = {
        desktop: [/*'react-hot-loader/patch', 'webpack-hot-middleware/client?name=desktop',*/ './$desktop/index'],
        mobile : [/*'react-hot-loader/patch', 'webpack-hot-middleware/client?name=mobile', */'./$mobile/index'],
        common : ['./EntryPoint']
    };

    // webpackConfig.module.loaders[0]['query']['plugins'].push('react-hot-loader/babel');

    webpackConfig.plugins.push(new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('development') } }));
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

    webpackConfig.devServer = {
        host        : 'localhost', // Defaults to `localhost`
        port        : 4001, // Defaults to 8080
        proxy       : {
            '/': {
                target: 'http://localhost:4000/',
                secure: false
            }
        },
        watchOptions: {
            aggregateTimeout: 300,
            poll            : 1000
        }
    };
} else {
    webpackConfig.entry = {
        desktop: './$desktop/index',
        mobile : './$mobile/index',
        common : './EntryPoint'
    };

    webpackConfig.plugins.push(new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }));
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
        // beautify: false,
        comments: false,
        compress: {
            sequences   : true,
            booleans    : true,
            loops       : true,
            unused      : true,
            warnings    : false,
            drop_console: true,
            unsafe      : true,
            keep_fnames : true
        },
        mangle  : {
            keep_fnames: true
        }
    }));
}

module.exports = webpackConfig;
