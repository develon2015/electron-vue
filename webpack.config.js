const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const DIR_PROJECT = path.resolve(__dirname, '.');
const DIR_SRC = path.resolve(DIR_PROJECT, 'src');
const DIR_DIST = path.resolve(DIR_PROJECT,'dist');

const CONFIG = {
    entry: {
        index: path.resolve(DIR_SRC, 'index.js'),
        exlib: path.resolve(DIR_SRC, 'exlib.js'),
    },
    output: {
        filename: '[name].js',
        path: DIR_DIST,
    },
    module: {
        rules: [
            { test: /\.vue$/, use: 'vue-loader' },
            { test: /\.css$/, use: ['vue-style-loader', 'css-loader'] },
            { test: /\.(html|png|jpg|ico)$/, use: 'file-loader?name=[name].[ext]' },
        ],
    },
    plugins: [new VueLoaderPlugin()],
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: DIR_DIST,
        https: false,
    },
    target: 'electron-renderer',
    // externals: ['jquery'],
};

function config(env = {}, argv) {
    if (env && env.production) {
        console.log('Build production');
        CONFIG.mode = 'production';
        delete CONFIG.devtool;
        delete CONFIG.devServer;
    }
    if (env && env.rebuild) {
        console.log('Rebuild production');
        if (process.platform.match(/^win.*/)) {
            // Implement this on Windows OS
            const child_process = require('child_process');
            try {
                child_process.execSync(`rmdir /S /Q ${DIR_DIST}`);
            } catch(error) { }
        }
    }
    return CONFIG;
}
module.exports = config;