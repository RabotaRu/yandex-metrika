import path from 'path';

export default function yandexMetrika (moduleOptions) {
  // don't include on dev mode
  if (!moduleOptions.development && process.env.NODE_ENV !== 'production') {
    return;
  }

  const {
    useCDN = false,
    noscript = true,
    counter
  } = moduleOptions;

  const libURL = !useCDN
    ? 'https://mc.yandex.ru/metrika/tag.js'
    : 'https://cdn.jsdelivr.net/npm/yandex-metrica-watch/tag.js';

  const isDynamicCounter = typeof counter === 'function';
  const includeInitContent = counter && !isDynamicCounter;
  const includeNoscript = noscript && counter && !isDynamicCounter;

  // yandex metrika init script
  let metrikaContent = `
    (function(m,e,t,r,i,k,a){
     m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
     m[i].l=1*new Date();
     k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "${libURL}", "ym");
  `;

  // main counter init script
  const metrikaInitContent = `
    ym(${counter}, "init", {
      id:52381765,
      clickmap:true,
      trackLinks:true,
      accurateTrackBounce:true
    });
  `;

  if (includeInitContent) {
    metrikaContent += metrikaInitContent;
  }

  const noscriptContent = `
    <div><img src="https://mc.yandex.ru/watch/${counter}" style="position:absolute; left:-9999px;" alt="" /></div>
  `;

  this.options.head.__dangerouslyDisableSanitizers = [ 'script' ];
  this.options.head.script = [].concat( this.options.head.script || [] ).unshift({
    innerHTML: metrikaContent,
    type: 'text/javascript',
    charset: 'utf-8'
  });

  if (includeNoscript) {
    this.options.head.noscript = [].concat( this.options.head.noscript || [] ).unshift({
      innerHTML: noscriptContent
    });
  }

  // register plugin
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    ssr: false,
    options: moduleOptions
  });
};

module.exports.meta = require( './package.json' );
