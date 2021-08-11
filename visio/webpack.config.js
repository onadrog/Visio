const path = require('path')
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const dev = process.env.NODE_ENV == "dev"
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

let config = {
    devtool: 'source-map',
    entry: {
        app: './assets/App.jsx'
    },
    output: {
        path: path.resolve(__dirname, './public/dist'),
        filename: '[name].js',
        publicPath: "/dist/",
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: 'commons',
                    chunks: 'all'
                }
            }
        }
    },
    mode: 'development',
    plugins: [
        new CleanWebpackPlugin(),
        new WebpackManifestPlugin()
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.m?jsx?$/i,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-react"],
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }
            }
        ]
    }

}

if (!dev) {
    config.devtool = false
    config.loader = {
        rules: [
            {
                test: /\.m?jsx?$/i,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', "@babel/preset-react"]
                    }
                }
            },
        ],
    },
        config.optimization = {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        name: 'commons',
                        chunks: 'all'
                    }
                }
            },
            minimize: true,
            minimizer: [new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            })],
        },
        config.mode = 'production',
        config.plugins = [
            new CleanWebpackPlugin(),
            new WebpackManifestPlugin()
        ],
        config.output = {
            path: path.resolve(__dirname, './public/dist'),
        filename: '[name].[chunkhash].min.js',
        publicPath: "/dist/",
        chunkFilename: '[name].[chunkhash].min.js'
        }
}

module.exports = config