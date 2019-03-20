# Yandex Metrika
[![npm](https://img.shields.io/npm/dt/@rabota/yandex-metrika.svg?style=flat-square)](https://www.npmjs.com/package/@rabota/yandex-metrika)
[![npm (scoped with tag)](https://img.shields.io/npm/v/@rabota/yandex-metrika/latest.svg?style=flat-square)](https://www.npmjs.com/package/@rabota/yandex-metrika)

> Add Yandex Metrika to your nuxt.js application.

This plugins automatically sends first page and route change events to [Yandex Metrika](https://metrica.yandex.com).

```
yarn add @rabota/yandex-metrika
```
or
```
npm install --save @rabota/yandex-metrika
```

## Table of contents

- [Features](#features)
- [Setup](#setup)
- [Options](#options)
- [Examples](#examples)
- [Methods](#methods)
- [License](#license)

## Features

- Yandex Metrica 2.0
- Supports multiple IDs
- You can pass an async function to provide IDs
- Easy-to-use API
- Automatically handling all SPA caveats
- Includes noscript content (`noscript: true` [option](#options))
- Logging

**Note:** Yandex Metrika is disabled in development mode by default.
You can set `development` option to `true` to run Yandex Metrika in development mode.

## Setup
- Add `@rabota/yandex-metrika` dependency using yarn or npm to your project
- Add `transpile` option to `build` section of `nuxt.config.js`
```js
transpile: [
  '@rabota/analytics-layer',
  '@rabota/yandex-metrika'
]
```
- Add `@rabota/yandex-metrika` to `modules` section of `nuxt.config.js`
```js
{
  modules: [
    ['@rabota/yandex-metrika', [
      staticCounters: [{
        id: 5432xxxx,
        webvisor: true,
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
      }],
      dynamicCounters (context) {
        // you can load it asynchronously and return promise
        return [{
          id: 1234xxxx,
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
        }, {
          id: 4567xxxx,
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
        }];
      },
      noscript: true, // insert `noscript` content for each counter
      logging: true, // logs all events to each counter
      development: true
    }]
  ]
}
````

## Options

### `staticCounters` 
```{Object|Array<Object>}``` Object or Array of objects

Each object contains Yandex.Metrika options for target counter. `staticCounters` inserts YM initialization configs during the server rendering.

### `dynamicCounters` 
```{Function}``` 

Could be an async function that returns one or array of configs.

You can find all Yandex Metrika options [here](https://yandex.com/support/metrica/code/counter-initialize.xml)

### `noscript` 
```{boolean}``` Insert noscript content for each counter (default: `true`).

### `logging` 
```{boolean}``` Output all sending events for each counter (default: `false`).

### `cdn` 
```{boolean}``` Use CDN (default: `false`).

### `development` 
```{boolean}``` set `true` if you want to run metrika in dev mode. By default metrika is disabled in dev mode.

For more information:
- [Documentation for Yandex Metrika](https://yandex.com/support/metrica/code/counter-initialize.html)
- [hit method](https://yandex.com/support/metrica/objects/hit.html)

## Methods

`this.$ym` - is a [Layer Instance](https://github.com/RabotaRu/analytics-layer).

`methods` or `properties` you can find here: [@rabota/analytics-layer/src/layer.js](https://github.com/RabotaRu/analytics-layer/blob/master/src/layer.js).

## Examples

After [setup](#setup) you can access the metrika through `this.$ym` instance in any component you need.

```js
export default {
  mounted () {
    this.$ym.event( 'event-name', params );
  }
}
```

Or you can send to a specific counter ID

```js
export default {
  mounted () {
    this.$ym.eventTo( 1234xxxx, 'event-name', params );
  }
}
```

## License

MIT

## Author

Alexander Belov (c) 2019
