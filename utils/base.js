/**
 * @param {*} options
 * @return {string}
 */
export function templateInitScript (options = {}) {
  return `
    ym(${id}, 'init', ${JSON.stringify( options )});
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
 * @param {number} id
 * @return {string}
 */
export function templateNoscriptInit ({ id }) {
  return `<div><img src="https://mc.yandex.ru/watch/${id}" style="position:absolute; left:-9999px;" alt="" /></div>`;
}
