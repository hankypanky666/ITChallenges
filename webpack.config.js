let webpack = require('webpack');

module.exports = {
    entry: "./code/js/WeatherWidget",
    output: {
        filename: "./app/bundle.js",
        library: "WeatherWidget"
    },

    watch: true,

    devtool: "source-map",

    module: {
        loaders: [
            {
                test: /\.hbs$/,
                loader: "handlebars-loader"
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel', // 'babel-loader' is also a valid name to reference
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.css$/,
                loader: "style!css"
            }
        ]
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};