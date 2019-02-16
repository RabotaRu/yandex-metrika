import { Layer } from "./layer";

export class YandexLayer extends Layer {

  static YANDEX_LAYER_KEY = 'ym';

  /**
   * @param {Array<number>} counters
   */
  constructor (counters) {
    super( counters );

    this.setLayer( YandexLayer.YANDEX_LAYER_KEY );
    this.setProvider( 'yandex' );
  }

  /**
   * @param {number} counterId
   * @param {*} args
   */
  pushTo (counterId, ...args) {
    this.push( counterId, ...args );
  }
}
