import { YandexLayer } from "@rabota/analytics-layer";

export default async (context, inject) => {
  const pluginOptions = <%= serialize(options) %>;

  const { app: { router } } = context;
  let {
    counter,
    includeCounters = [],
    options = {}, // yandex metrika options
    logging = false
  } = pluginOptions;

  const layer = new YandexLayer({
    logging, options
  });

  // inject yandex metrika layer into context
  inject( 'ym', layer );

  const isAvailable = typeof window !== 'undefined' && !!window[ layer.layerName ];

  if (!isAvailable) {
    return;
  }

  const isDynamicCounter = typeof counter === 'function';
  const isDynamicIncludedCounters = typeof includeCounters === 'function';

  // resolve all counters
  counter = await resolveCounters( counter, context ).then(counters => {
    return counters && counters.length && counters[ 0 ];
  });

  includeCounters = await resolveCounters( includeCounters, context );

  // set resolved counters
  layer.setCounter( counter );
  layer.setIncludedCounters( includeCounters );

  // assemble counters still not initialized
  const countersToInit = [];

  if (isDynamicCounter) {
    countersToInit.push( counter );
  }

  if (isDynamicIncludedCounters) {
    countersToInit.push( ...includeCounters );
  }

  layer.init( countersToInit );

  // subscribe to router events
  let firstHit = true;
  router && router.afterEach((to, from) => {
    const fromPath = from.fullPath;
    const toPath = to.fullPath;

    const options = {};

    if (!firstHit) {
      Object.assign(options, { referer: fromPath });
    } else {
      firstHit = false;
    }

    const restArgs = Object.keys( options ).length > 0
      ? [ options ]
      : [];

    // send new page url with the referer to each counter
    layer.pushAll( 'hit', toPath, ...restArgs );
  });
}

/**
 * @param {number|string|Array<number|string>|Function} countersOrFn
 * @param {*} context
 * @return {Promise<Array<string|number>>}
 */
async function resolveCounters (countersOrFn, context) {
  const useFn = typeof countersOrFn === 'function';
  const wrappedFn = Promise.resolve(
    useFn
      ? countersOrFn( context )
      : countersOrFn
  );

  return wrappedFn.then(counters => {
    return [].concat( counters || [] );
  });
}
