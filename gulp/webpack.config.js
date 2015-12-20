var webpack = require('webpack');

module.exports = {
    entry: [
        './src/cate_container'
    ],
    output: {
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.js']
    },
    watch: true,
    module: {
        loaders: [
            { test: /\.js$/, loaders: [], exclude: /node_modules/ }
        ]
    }
};
