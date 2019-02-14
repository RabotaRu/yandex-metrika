# Yandex Metrika
[![npm](https://img.shields.io/npm/dt/@rabota/yandex-metrika.svg?style=flat-square)](https://www.npmjs.com/package/@rabota/yandex-metrika)
[![npm (scoped with tag)](https://img.shields.io/npm/v/@rabota/yandex-metrika/latest.svg?style=flat-square)](https://www.npmjs.com/package/@rabota/yandex-metrika)

> Add Yandex Metrika to your nuxt.js application.

This plugins automatically sends first page and route change events to yandex metrika.

**Note:** yandex metrika is disabled in development mode by default.
You can set `development` option to `true` to run Yandex Matrika in development mode.

## Setup
- Add `@rabota/yandex-metrika` dependency using yarn or npm to your project
- Add `@rabota/yandex-metrika` to `modules` section of `nuxt.config.js`
```js
{
  modules: [
    [
      '@rabota/yandex-metrika', {
        counters: [ 5238xxxx, 5238xxxx ], // you can specify single OR multiple IDs
        options: {
          // webvisor: true,
          // clickmap:true,
          // trackLinks:true,
          // accurateTrackBounce:true,
        }
      }
    ],
  ]
}
````

## Plugin options

### `development` - set `true` if you want to run metrika in dev mode

### `counters` - Array of counters IDs

### `options`- Yandex Metrika [options](https://yandex.com/support/metrica/code/counter-initialize.xml)
* `webvisor`
* `clickmap`
* `trackLinks`
* `accurateTrackBounce`

For more information:
- [Documetation for Ya.Metrika](https://yandex.com/support/metrica/code/counter-initialize.xml)
- [hit method](https://yandex.com/support/metrica/objects/hit.xml)
