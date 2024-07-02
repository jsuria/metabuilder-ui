/* const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
 */

// vue.config.js
module.exports = {
  devServer: {
        proxy: 'https://my.api.mockaroo.com/images_with_keywords.json?key=ccef3e10',
    }
}