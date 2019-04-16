import path from 'path';
import { templateInitScripts2, templateNoscriptInit } from "./utils";

export default function yandexMetrika (moduleOptions) {
  // don't include on dev mode
  if (!moduleOptions.development && process.env.NODE_ENV !== 'production') {
    return;
  }

  const {
    useCDN = false,
    staticCounters,
    noscript = true,
  } = moduleOptions;

  const libURL = !useCDN
    ? 'https://mc.yandex.ru/metrika/tag.js'
    : 'https://cdn.jsdelivr.net/npm/yandex-metrica-watch/tag.js';

  const bootCounters = [].concat( staticCounters || [] );

  const metrikaContent = templateInitScripts2( bootCounters, libURL );

  this.options.head.__dangerouslyDisableSanitizers = [ 'script', 'noscript' ];
  this.options.head.script.unshift({
    innerHTML: metrikaContent.trim()
  });

  // include noscript
  if (noscript) {
    const noscripts = bootCounters.map(counter => {
      return {
        innerHTML: templateNoscriptInit( counter ),
        body: true
      };
    });

    this.options.head.noscript = []
      .concat( this.options.head.noscript || [] )
      .concat( noscripts );
  }

  // register plugin
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    ssr: true,
    options: moduleOptions
  });
};

module.exports.meta = require( './package.json' );
