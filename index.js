import path from 'path';

export default function yandexMetrika (moduleOptions) {
  // don't include on dev mode
  if (!moduleOptions.development && process.env.NODE_ENV !== 'production') {
    return;
  }

  const useCDN = moduleOptions.cdn;
  const libURL = !useCDN
    ? 'https://mc.yandex.ru/metrika/tag.js'
    : 'https://cdn.jsdelivr.net/npm/yandex-metrica-watch/tag.js';

  // include metrika script content
  const metrikaContent = `
    (function(m,e,t,r,i,k,a){
     m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
     m[i].l=1*new Date();
     k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "${libURL}", "ym");
  `;

  this.options.head.__dangerouslyDisableSanitizers = [ 'script' ];
  this.options.head.script.unshift({
    innerHTML: metrikaContent,
    type: 'text/javascript',
    charset: 'utf-8'
  });

  // register plugin
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    ssr: false,
    options: moduleOptions
  });
};

module.exports.meta = require( './package.json' );
