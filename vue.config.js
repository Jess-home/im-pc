// const proxyPath = 'http://192.168.14.241:9999/'
const proxyPath = 'http://59.110.158.12:9999/'


module.exports = {
  lintOnSave: false,
  productionSourceMap: false,

  // 指定打包文件名
  // 默认
  // outputDir: 'dist',
  publicPath: './',

  chainWebpack: config => {
    // 忽略的打包文件
    if (process.env.NODE_ENV === 'production') {
      // config
      //   .plugin('uglifyjs-plugin')
      //   .use('uglifyjs-webpack-plugin', [{
      //     uglifyOptions: {
      //       warnings: false,
      //       compress: {
      //         drop_console: true,
      //         drop_debugger: false,
      //         pure_funcs: ['console.log']
      //       }
      //     }
      //   }])
      //   .end()

      // 开启打包压缩 减少包体积
      // config.plugin('gzip-plugin')
      //   .use('compression-webpack-plugin', [{
      //     filename: '[path].gz[query]',
      //     algorithm: 'gzip',
      //     test: /\.js$|\.html$|\.json$|\.css$|\.ttf$/,
      //     threshold: 500, // 只有大小大于该值的资源会被处理
      //     minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
      //     deleteOriginalAssets: true // 删除原文件
      //   }])
      //   .end()
    }
    const entry = config.entry('app')
    entry
      .add('babel-polyfill')
      .end()
    entry
      .add('classlist-polyfill')
      .end()
  },

  // 代理配置
  devServer: {
    disableHostCheck: true,
    port: 8080
  }
}
