const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = merge(
    commonConfiguration,
    {
        output: {
            publicPath: 'love-donuts/',
        },

        mode: 'production',
        plugins:
        [
            new CleanWebpackPlugin()
        ]
    }
)
