// var webpack = require('webpack');

module.exports = {
    // entry: [
    //     './src/cate_container'
    // ],
    output: {
        filename: 'bundle.js',
        libraryTarget: "this"
    },
    resolve: {
        extensions: ['', '.js']
    },
    watch: false,
    externals: ['underscore'],//忽略 underscore 依赖 (ingore underscore, used with output.libraryTarget.)
    module: {
        loaders: [
            { test: /\.js$/, loaders: [], exclude: /node_modules/ }
        ]
    }
};

