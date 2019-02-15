const YANDEX_DISPATCH_KEY = 'ym';

export default (context, inject) => {
  const pluginOptions = <%= serialize(options) %>;

  const { app: { router } } = context;

  router.onReady(() => {
    // Mark when the router has completed the initial navigation.
    // ready = true
  });

  const boundCreate = create.bind( null, pluginOptions, context );
  const registered = !!window[ YANDEX_DISPATCH_KEY ];

  registered
    ? boundCreate()
    : register( boundCreate );

  // inject yandex metrika function
  inject( 'yandexMetrika', send );
}

/**
 * @param {Function} create
 */
function register (create) {
  window[ YANDEX_DISPATCH_KEY ] = window[ YANDEX_DISPATCH_KEY ] || function() {
    ( window[ YANDEX_DISPATCH_KEY ].a = window[ YANDEX_DISPATCH_KEY ].a || [] ).push( arguments );
  };

  window[ YANDEX_DISPATCH_KEY ].l = 1 * new Date();

  create();
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
  console.log( '[Yandex.Metrika] [Sent Arguments]:', ...args );
  window[ YANDEX_DISPATCH_KEY ]( ...args );
}
