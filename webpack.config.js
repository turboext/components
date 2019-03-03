const { resolve } = require('path');
const { cpus } = require('os');

const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: resolve(__dirname, '.tmp/registry.tsx'),

    watch: true,

    devtool: 'inline-cheap-source-map',

    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'index.js'
    },

    resolve: {
        modules: ['node_modules'],
        extensions: [
            '.js',
            '.json',
            '.ts',
            '.tsx',
            '.scss'
        ]
    },

    module: {
        rules: [
            {
                test: /\.scss$/u,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            config: { path: resolve('./postcss.config') },
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(ts|tsx)$/u,
                use: [
                    {
                        loader: 'thread-loader',
                        options: {
                            workers: cpus().length - 2
                        }
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        targets: {
                                            ie: 11,
                                            chrome: 55,
                                            ios: 9,
                                            android: 4
                                        },
                                        modules: false,
                                        loose: true
                                    }
                                ],
                                '@babel/preset-react'
                            ],
                            plugins: [
                                'babel-plugin-transform-react-remove-prop-types',
                                '@babel/plugin-syntax-dynamic-import',
                                '@babel/plugin-transform-react-constant-elements',
                                '@babel/plugin-proposal-object-rest-spread',
                                '@babel/plugin-transform-object-assign'
                            ]
                        }
                    },
                    {
                        loader: 'ts-loader',
                        options: { happyPackMode: true }
                    }
                ]
            },
            {
                test: /\.inline\.\w+$/u,
                loader: 'raw-loader'
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            process: { env: JSON.stringify(process.env) }
        }),
        new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true,
            tsconfig: resolve(__dirname, 'tsconfig.json')
        }),
        new MiniCssExtractPlugin({
            filename: 'index.css'
        })
    ],

    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },

    performance: {
        hints: false
    },

    mode: 'development'
};
