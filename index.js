import path from 'path';

export default function yandexMetrika (moduleOptions) {
  // don't include on dev mode
  if (!moduleOptions.development && process.env.NODE_ENV !== 'production') {
    return;
  }

  // Add yandex metrika script to head
  this.options.head.script.push({
    src: 'https://mc.yandex.ru/metrika/tag.js', // 'https://mc.yandex.ru/metrika/watch.js'
    async: ''
  });

  // register plugin
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    ssr: false,
    options: moduleOptions
  });
};

module.exports.meta = require( './package.json' );
