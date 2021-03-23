'use strict';
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir)
}

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
    /**
     * You will need to set publicPath if you plan to deploy your site under a sub path,
     * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
     * then publicPath should be set to "/bar/".
     * In most cases please use '/' !!!
     * Detail: https://cli.vuejs.org/config/#publicpath
     */
    publicPath: './',
    outputDir: 'dist',
    assetsDir: '',
    productionSourceMap: false,

    configureWebpack: {
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        externals : {
            'vue': 'Vue'
        },
        name: '级联选择',
        resolve: {
            alias: {
                '_c': resolve('src'),
            }
        }
    },
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    require('postcss-pxtorem')({
                        rootValue: 25,
                        propList: ['*']
                    })
                ]
            }
        }
    }
};
