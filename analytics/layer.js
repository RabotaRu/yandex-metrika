export class Layer {

  /**
   * @type {string}
   * @private
   */
  _provider = '';

  /**
   * @type {string}
   * @private
   */
  _layerName = '';

  /**
   * @type {Array<string|number>}
   * @private
   */
  _counters = [];

  /**
   * @param {Array<string|number>} counters
   */
  constructor (counters = []) {
    this._counters = counters;
  }

  /**
   * @param {string} provider
   */
  setProvider (provider) {
    this._provider = provider;
  }

  /**
   * @param {string} layerName
   */
  setLayer (layerName) {
    this._layerName = layerName;
  }

  /**
   * @param {Array<string|number>} counters
   */
  setCounters (counters = []) {
    this._counters = counters;
  }

  /**
   * @param {*} args
   */
  pushAll (...args) {
    for (let i = 0; i < this._counters.length; ++i) {
      this.pushTo( this._counters[ i ], ...args );
    }
  }

  /**
   * @param {string|number} counterId
   * @param {*} args
   * @abstract
   */
  pushTo (counterId, ...args) {
  }

  /**
   * @param {*} args
   */
  push (...args) {
    if (typeof window === 'undefined') {
      return;
    }

    this._log( ...args );

    window[ this._layerName ]( ...args );
  }

  /**
   * @return {string}
   */
  get provider () {
    return this._provider;
  }

  /**
   * @param args
   * @private
   */
  _log (...args) {
    console.log(
      `[Analytic service: ${this._capitalize(this._provider)}]`,
      ...args
    );
  }

  /**
   * @param {string} text
   * @return {string}
   * @private
   */
  _capitalize (text) {
    return text[ 0 ].toUpperCase() + text.substr( 1 );
  }
}
