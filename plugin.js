const YANDEX_DISPATCH_KEY = 'ym';

let ready = false;

export default (context, inject) => {
  const pluginOptions = <%= JSON.stringify(options) %>;

  const { app: { router } } = context;

  router.onReady(() => {
    // Mark when the router has completed the initial navigation.
    ready = true
  });

  const boundCreate = create.bind( null, pluginOptions, context );
  const registered = !!window[ YANDEX_DISPATCH_KEY ];

  registered
    ? boundCreate() // Yandex.Metrika API is already available.
    : register( boundCreate ); // Yandex.Metrika has not loaded yet, register a callback.

  // inject yandex metrika function
  inject( 'yandexMetrika', send );
}

/**
 * @param {Function} callback
 */
function register (callback) {
  (function (r, a) {
    r[a] = r[a] || function () {
      ( r[a].a = r[a].a || [] ).push( arguments );
    };

    r[a].l = Date.now();

    console.log( 'registered' );

    callback();
  })(window, 'ym');
}

/**
 * Creates metrika with specific counters
 *
 * @param {Object} pluginOptions
 * @param {Object|Vue.Router} router
 */
function create (pluginOptions, { app: { router } }) {
  console.log( 'create', pluginOptions );

  const counters = [].concat( pluginOptions.counters || [] );
  const { options = {} } = pluginOptions;

  counters.forEach(counterId => {
    options.id = counterId;

    send( counterId, 'init', options );

    console.log( 'metrika inited:', counterId );
  });

  router.afterEach((to, from) => {
    console.log( 'afterEach:', from.fullPath, to.fullPath );
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
  console.log( 'hitToAll:', counters, fromPath, toPath );

  counters.forEach(counterId => {
    console.log( `Hit to: ${counterId}. From: ${fromPath}. To: ${toPath}.` );

    send(counterId, 'hit', toPath, {
      referer: fromPath
      // TODO: pass title: <new page title>
      // This will need special handling because router.afterEach is called *before* DOM is updated.
    });
  });
}

/**
 * @param args
 */
function send (...args) {
  console.log( '[Yandex.Metrika] send', ...args );
  window[ YANDEX_DISPATCH_KEY ]( ...args );
}
