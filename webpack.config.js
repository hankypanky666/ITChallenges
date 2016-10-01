module.exports = {
    entry: "./js/WeatherWidget",
    output: {
        filename: "bundle.js",
        library: "WeatherWidget"
    },

    watch: true,

    devtool: "source-map",

    module: {
        loaders: [
            {
                test: /\.hbs$/,
                loader: "handlebars-loader"
            }
        ]
    }
};