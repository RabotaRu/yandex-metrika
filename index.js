import path from 'path';

module.exports = function yandexMetrika (options) {
  // don't include on dev mode
  if (!options.development && process.env.NODE_ENV !== 'production') {
    return;
  }

  // Add yandex metrika script to head
  this.options.head.script.push({
    src: 'https://mc.yandex.ru/metrika/tag.js', // https://mc.yandex.ru/metrika/watch.js',
    async: 1
  });

  // register plugin
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    ssr: false,
    options
  });
};

module.exports.meta = require( './package.json' );
