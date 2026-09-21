const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const webpack = require('webpack')

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  transpileDependencies: true,
  lintOnSave: false,
  
  devServer: {
    port: 8080,
    open: true,
    historyApiFallback: true,
    proxy: {
      '/admin': {
        target: 'http://backendapi.bjyxfl.com',  // 
       // target: 'http://testbackendapi.bjyxfl.com',  //  
        changeOrigin: true,
        secure: false
      }
    }
  },
  
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      },
      fallback: {
        "path": require.resolve("path-browserify"),
        "process": require.resolve("process/browser")
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      })
    ]
  },
  
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.output
        .filename('static/js/[name].[contenthash:8].js')
        .chunkFilename('static/js/[name].[contenthash:8].js')
      
      config.plugin('extract-css').tap(args => [{
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].css'
      }])
    }
  }
})