module.exports = {
  chainWebpack: config => {
    // 增加对bmp图片格式的支持.
    const urlRule = config.module.rule('url-loader')
    urlRule.uses.clear()
    urlRule
      .test(/\.(bmp)$/)
      .use('url-loader')
      .loader('url-loader')
      .end()
  }
}
