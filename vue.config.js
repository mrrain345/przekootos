const path = require('path');

module.exports = {
  lintOnSave: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
      },
    },
  },
  chainWebpack: (config) => {
    config
      .entry('app')
      .clear()
      .add('./frontend/main.js')
      .end();
    config.resolve.alias
      .set('@', path.join(__dirname, './frontend'));
  },
};
