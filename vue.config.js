// Created by szatpig at 2019/4/8.
const path = require('path');
function resolve(dir) {
    return path.join(__dirname, './', dir)
}


const externals = {
    'vue':'Vue',
    'vue-router':'VueRouter',
    'vuex':'Vuex',
    'axios':'axios',
    'vant':'vant',
    // 'vue2-dragula':'vueDragula'
}


module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
            ? process.env.VUE_APP_ROOT //这里是打包正式配置 eg: outbound.ynt.ai:7001/crm/#/login
            : '/',
    outputDir:'docs',
    productionSourceMap: false,
    chainWebpack: config => {
        config.externals(externals);
        config.resolve.extensions.merge(['.js', '.vue', '.json','.scss','.less']);
        config.resolve.alias.set('@@', path.resolve(__dirname,'./public'));
        if(process.env.NODE_ENV==='production' && process.env.npm_config_report){
            config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
        }

        config.module
                .rule('svg')
                .exclude.add(resolve('src/images/svg'))
                .end()

        config.module
                .rule('icons')
                .test(/\.svg$/)
                .include.add(resolve('src/images/svg'))
                .end()
                .use('svg-sprite-loader')
                .loader('svg-sprite-loader')
                .options({
                    symbolId: 'icon-[name]'
                })
    },
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true,
            },
            postcss: {
                // options here will be passed to postcss-loader
                plugins: [require('postcss-px2rem')({
                    remUnit: 75
                })]
            }
        }
    },
    pluginOptions: {
      vconsole: { enable: true /* others... */ },
      'style-resources-loader': {
        preProcessor: 'less',
        patterns: [
            resolve('/src/sass/themes.less')
        ]
      }
    },

    devServer: {
        host: '0.0.0.0',
        port: 5000,
        https: false,
        hotOnly: false,
        // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
        proxy: {
            '/api': {
                target: 'http://192.168.88.51:8083',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ``            //本地run dev接口代理
                }
            },
            '/common': {
                target: 'http://10.99.1.133:12222',
                changeOrigin: true,
                pathRewrite: {
                    '^/common': ''
                }
            }
        }, // string | Object
        before: app => {}
    }
};
