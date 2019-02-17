import { YandexLayer } from "@rabota/analytics-layer";

export default async (context, inject) => {
  const registered = !!window[ 'ym' ];

  if (!registered) {
    return;
  }

  const pluginOptions = <%= serialize(options) %>;

  const { app: { router } } = context;
  let {
    counter,
    includeCounters = [],
    options = {}, // yandex metrika options
    logging = false
  } = pluginOptions;

  const isDynamicCounter = typeof counter === 'function';
  const isDynamicIncludedCounters = typeof includeCounters === 'function';

  // resolve all counters
  counter = await resolveCounters( counter, context ).then(counters => {
    return counters && counters.length && counters[ 0 ];
  });
  includeCounters = await resolveCounters( includeCounters, context );

  // create analytics layer (interface for different services)
  const layer = new YandexLayer({
    counter, includeCounters,
    logging, options
  });

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

  // inject yandex metrika layer into context
  inject( 'ym', layer );
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
