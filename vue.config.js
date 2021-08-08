module.exports = {
    productionSourceMap: process.env.NODE_ENV !== 'production',
    outputDir: 'docs',
    pages: {
        index: {
            entry: "src/main.js",
            title: "Maneuver",
        }
    },
    configureWebpack: {
        output: {
            filename: '[name].js',
            chunkFilename: '[name].js'
        },
    },
    css: {
        extract: {
            filename: '[name].css',
        },
    },
    devServer: {
        port: 8090,
    }
}