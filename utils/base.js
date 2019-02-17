/**
 * @param {number} id
 * @param {*} options
 * @return {string}
 */
export function templateInitScript (id, options = {}) {
  const copiedOptions = Object.assign(
    {}, options, { id }
  );

  return `
    ym(${id}, "init", ${JSON.stringify( copiedOptions )});
  `;
}

/**
 * @param {Array<number>} counters
 * @param {*} options
 * @return {*}
 */
export function templateInitScripts (counters, options) {
  return counters.reduce((result, id) => {
    return result + templateInitScript( id, options );
  }, '');
}

/**
 * @param {number} id
 * @return {string}
 */
export function templateNoscriptInit (id) {
  return `<div><img src="https://mc.yandex.ru/watch/${id}" style="position:absolute; left:-9999px;" alt="" /></div>`;
}
