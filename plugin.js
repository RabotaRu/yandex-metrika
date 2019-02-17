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

  // resolve all counters
  includeCounters = await resolveCounters( includeCounters, context );
  counter = await resolveCounters( counter, context ).then(counters => {
    return counters && counters.length && counters[ 0 ];
  });

  const layer = new YandexLayer({
    counter, includeCounters, logging, options
  });

  layer.init( includeCounters );

  router.afterEach((to, from) => {
    const fromPath = from.fullPath;
    const toPath = to.fullPath;

    // send new page url with the referer to each counter
    layer.pushAll('hit', toPath, {
      referer: fromPath
    });
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
