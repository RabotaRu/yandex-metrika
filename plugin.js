let ready = false;

export default (context, inject) => {
  const pluginOptions = <%= JSON.stringify(options) %>;

  const { app: { router } } = context;

  router.onReady(() => {
    // Mark when the router has completed the initial navigation.
    ready = true
  });

  const hasMetrika = window.Ya && window.Ya.Metrika;
  const boundCreate = create.bind( null, pluginOptions, context );

  hasMetrika
    ? boundCreate() // Yandex.Metrika API is already available.
    : register( boundCreate ); // Yandex.Metrika has not loaded yet, register a callback.

  // test yandex metrika inject
  inject('yandexMetrika', (string) => console.log('That was easy!', string));
}

/**
 * @param {Function} callback
 */
function register (callback) {
  (function (w, c) {
    (w[c] = w[c] || []).push( callback )
  })(window, 'yandex_metrika_callbacks');
}

/**
 * Creates metrika with specific counters
 *
 * @param {Object} pluginOptions
 * @param {Object|Vue.Router} router
 */
function create (pluginOptions, { app: { router } }) {
  const counters = [].concat( pluginOptions.counters || [] );
  const { options = {} } = pluginOptions;

  counters.forEach(counterId => {
    options.id = counterId;

    window[ windowKey( counterId ) ] = new Ya.Metrika(
      JSON.stringify( options )
    );
  });

  router.afterEach((to, from) => {
    if (!ready) {
      // don't record a duplicate hit for the initial navigation.
      return;
    }

    hitToAll( counters, from.fullPath, to.fullPath );
  });
}

/**
 * @param {number[]} counters
 * @param {string} fromPath
 * @param {string} toPath
 */
function hitToAll (counters = [], fromPath = '/', toPath = '/') {
  counters.forEach(counterId => {
    console.log( `Hit to: ${counterId}. From: ${fromPath}. To: ${toPath}.` );

    window[ windowKey( counterId ) ].hit(toPath, {
      referer: fromPath
      // TODO: pass title: <new page title>
      // This will need special handling because router.afterEach is called *before* DOM is updated.
    });
  });
}

/**
 * @param {number} counterId
 * @returns {string}
 */
function windowKey (counterId) {
  return `yaCounter${counterId}`;
}
