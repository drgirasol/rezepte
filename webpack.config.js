const {VueLoaderPlugin} = require('vue-loader');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: "development",
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new VueLoaderPlugin()
    ],
    module: {
        rules: [
            // Regel für jQuery
            {
                test: require.resolve('jquery'),
                loader: 'expose-loader',
                options: {
                    exposes: ['$', 'jQuery'],
                },
            },
            // Regel für Popper.js
            {
                test: require.resolve('popper.js'),
                loader: 'expose-loader',
                options: {
                    exposes: ['Popper'],
                },
            },
            // Regel für Bootstrap
            {
                test: require.resolve('bootstrap'),
                use: [
                    {
                        loader: 'imports-loader',
                        options: {
                            type: 'commonjs',
                            imports: [
                                'jquery',
                                'popper.js',
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm-browser.js'
        },
        extensions: ['*', '.js', '.vue', '.json'],
        // fallback: { "path": require.resolve("path-browserify") }
    }
};
