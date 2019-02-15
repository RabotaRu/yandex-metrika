import path from 'path';

export default function yandexMetrika (moduleOptions) {
  // don't include on dev mode
  if (!moduleOptions.development && process.env.NODE_ENV !== 'production') {
    return;
  }

  const metrikaContent = `
    (function(m,e,t,r,i,k,a){
     m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
     m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
  `;

  this.options.build.plugins.push({
    apply (compiler) {
      compiler.plugin('emit', (compilation, cb) => {

        compilation.assets[ 'yandex-metrika' ] = {
          source: () => metrikaContent,
          size: () => metrikaContent.length
        };

        cb();
      })
    }
  });

  this.options.head.script.push({
    src: require( '~/assets/yandex-metrika.js' ), // 'https://mc.yandex.ru/metrika/watch.js'
    async: true
  });

  // Add yandex metrika script to head
  /*this.options.head.script.push({
    src: 'https://mc.yandex.ru/metrika/tag.js', // 'https://mc.yandex.ru/metrika/watch.js'
    async: true
  });*/

  // register plugin
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    ssr: false,
    options: moduleOptions
  });
};

module.exports.meta = require( './package.json' );
