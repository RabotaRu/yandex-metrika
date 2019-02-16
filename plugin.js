import { YandexLayer } from "@rabota/analytics-layer";

export default async (context, inject) => {
  const registered = !!window[ 'ym' ];

  if (!registered) {
    return;
  }

  const pluginOptions = <%= serialize(options) %>;
  const counters = await resolveCounters( pluginOptions.counters, context );

  const { app: { router } } = context;
  const { options = {} } = pluginOptions;

  const yandexLayer = new YandexLayer( counters );

  let ready = false;
  router.onReady(() => {
    // mark when the router has completed the initial navigation.
    ready = true
  });

  // init each yandex counter
  counters.forEach(counterId => {
    options.id = counterId;

    yandexLayer.pushTo( counterId, 'init', options );
  });

  router.afterEach((to, from) => {
    if (!ready) {
      // don't record a duplicate hit for the initial navigation.
      return
    }

    const fromPath = from.fullPath;
    const toPath = to.fullPath;

    // send new page url with the referer to each counter
    yandexLayer.pushAll('hit', toPath, {
      referer: fromPath
    });
  });

  // inject yandex metrika layer into context
  inject( 'ym', yandexLayer );
}

/**
 * @param {number|string|Array<number|string>|Function} countersOrFn
 * @param {*} context
 * @return {Promise<*>}
 */
async function resolveCounters (countersOrFn, context) {
  if (typeof countersOrFn === 'function') {
    return countersOrFn( context );
  }

  return [].concat( countersOrFn || [] );
}
