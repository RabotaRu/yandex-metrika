import { YandexLayer } from "@rabota/analytics-layer";

export default async (context, inject) => {
  const pluginOptions = <%= serialize(options) %>;

  const { app: { router } } = context;
  let {
    staticCounters = [],
    dynamicCounters = [],
    hitParams,
    manualFirstHit = false,
    logging = false,
  } = pluginOptions;

  const layer = new YandexLayer({
    logging, staticCounters
  });

  // inject yandex metrika layer into context
  inject( 'ym', layer );

  const isAvailable = typeof window !== 'undefined' && !!window[ layer.layerName ];

  if (!isAvailable) {
    return;
  }

  // resolve all counters
  dynamicCounters = await resolveCounters( dynamicCounters, context );

  // set resolved dynamic counters
  layer.setDynamicCounters( dynamicCounters );

  // init dynamic counters
  layer.init( dynamicCounters );

  // subscribe to router events
  let firstHit = true;
  router && router.afterEach((to, from) => {
    let toPath = to.fullPath;
    let fromPath = from.fullPath;

    const options = {};

    if (firstHit) {
      // set referer to null when the first hit
      fromPath = null;
      firstHit = false;

      if (!manualFirstHit) {
        return;
      }
    }

    const hasHitParamsFn = typeof hitParams === 'function';
    const params = hasHitParamsFn && hitParams( context );

    if (params) {
      Object.assign(options, { params });
    }

    // send new page url with the referer to each counter
    layer.hit( toPath, fromPath, options );
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
