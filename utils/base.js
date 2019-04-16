/**
 * @param {*} options
 * @return {string}
 */
export function templateInitScript (options = {}) {
  return `
    ym(${options.id}, 'init', ${JSON.stringify( options )});
  `;
}

/**
 * @param {Array<number>} counters
 * @return {*}
 */
export function templateInitScripts (counters) {
  return counters.reduce((result, counter) => {
    return result + templateInitScript( counter );
  }, '');
}

/**
 * @param {Array<number>} counters
 * @param libURL
 * @return {*}
 */
export function templateInitScripts2 (counters, libURL) {
  const metrics = counters.reduce((result, counter) => {
    return result + templateInitScript2( counter );
  }, '');

  return `
    (function(s, b, a) {
      (b[a] = b[a] || []).push(function() {
        try {
          ${metrics}
        } catch (f) {}
      });
      var e = s.getElementsByTagName("script")[0],
        c = s.createElement("script");
      a = function() {
        e.parentNode.insertBefore(c, e)
      };
      c.type = "text/javascript";
      c.async = !0;
      c.src = "${libURL}";
      "[object Opera]" == b.opera ? s.addEventListener("DOMContentLoaded", a, !1) : a()
    })(document, window, "yandex_metrika_callbacks2");
  `;
}


/**
 * @param {*} options
 * @return {string}
 */
export function templateInitScript2 (options = {}) {
  const id = options.id;

  return `b.yaCounter${id} = new Ya.Metrika2(${JSON.stringify( options )})`;
}

/**
 * @param {number} id
 * @return {string}
 */
export function templateNoscriptInit ({ id }) {
  return `<div><img src="https://mc.yandex.ru/watch/${id}" style="position:absolute; left:-9999px;" alt="" /></div>`;
}
