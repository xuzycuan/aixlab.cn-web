const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    publicPath:'./',
    transpileDependencies: true,
    lintOnSave: false,
    devServer: {
        port: 8081
    },
    chainWebpack: (config) => {
        config.plugin('html').tap((args) => {
            args[0].title = '智能系统积木化组装平台'
            return args
        })
    },
    configureWebpack: config => {
    // 为生产环境修改配置...
    if (process.env.NODE_ENV === 'production') {
        config.mode = 'production';
        // 打包文件大小配置
        config.performance = {
            maxEntrypointSize: 10000000,
            maxAssetSize: 30000000
        }
    }
}
})
