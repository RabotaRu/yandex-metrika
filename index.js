import path from 'path';
import { templateInitScripts, templateNoscriptInit } from "./utils";

export default function yandexMetrika (moduleOptions) {
  // don't include on dev mode
  if (!moduleOptions.development && process.env.NODE_ENV !== 'production') {
    return;
  }

  const {
    useCDN = false,
    noscript = true,
    counter,
    includeCounters,
    options
  } = moduleOptions;

  const libURL = !useCDN
    ? 'https://mc.yandex.ru/metrika/tag.js'
    : 'https://cdn.jsdelivr.net/npm/yandex-metrica-watch/tag.js';

  const isDynamicCounter = typeof counter === 'function';
  const isDynamicIncludedCounters = typeof includeCounters === 'function';

  const includeCounterBoot = counter && !isDynamicCounter;
  const includeAdditionalCountersBoot = includeCounters && !isDynamicIncludedCounters;

  const bootCounters = [];

  if (includeCounterBoot) {
    bootCounters.push( counter );
  }

  if (includeAdditionalCountersBoot) {
    bootCounters.push( ...includeCounters );
  }

  // yandex metrika init script
  let metrikaContent = `
    (function(m,e,t,r,i,k,a){
     m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
     m[i].l=1*new Date();
     k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "${libURL}", "ym");
  `;

  // include counters init script
  metrikaContent += templateInitScripts( bootCounters, options );

  this.options.head.__dangerouslyDisableSanitizers = [ 'script', 'noscript' ];
  this.options.head.script.unshift({
    innerHTML: metrikaContent.trim()
  });

  // include noscript
  if (noscript) {
    const noscripts = bootCounters.map(id => {
      return {
        innerHTML: templateNoscriptInit( id )
      };
    });

    this.options.head.noscript = []
      .concat( this.options.head.noscript || [] )
      .concat( noscripts );
  }

  // register plugin
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    ssr: false,
    options: moduleOptions
  });
};

module.exports.meta = require( './package.json' );
