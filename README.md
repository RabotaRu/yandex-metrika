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
- Add `@rabota/yandex-metrika` to `modules` section of `nuxt.config.js`
```js
{
  modules: [
    ['@rabota/yandex-metrika', [
      counter: 5876xxxx, // main counter
      includeCounters: [ 1234xxxx, ..., 4321xxxx ], // additional IDs
      options: {
        defer: true, // required by single page applications
        webvisor: true,
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
      },
      noscript: true, // insert `noscript` content for each counter
      logging: true, // logs all events to each counter
      development: true
    }]
  ]
}
````

## Options

### `counter` 
```{number|Function}``` Counter ID

Could be an async function that returns an ID.

### `includeCounters` 
```{number|Array<number>|Function}``` Additional counters IDs

Could be an async function that returns one or array of IDs.

### `options` 
```{Object}``` Yandex Metrika [options](https://yandex.com/support/metrica/code/counter-initialize.xml)

* `webvisor`
* `clickmap`
* `trackLinks`
* `trackHash`
* `accurateTrackBounce`
* `defer`

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

### `#pushAll`

The same as `ym` [function](https://yandex.com/support/metrica/code/counter-initialize.html) of Yandex Metrika except you don't need provide any IDs as first argument.
Sends arguments to each counter.

### `#pushTo`

The same as `ym` [function](https://yandex.com/support/metrica/code/counter-initialize.html) of Yandex Metrika
Sends arguments to specific counter.

Rest `methods` or `properties` you can find here: [@rabota/analytics-layer/src/layer.js](https://github.com/RabotaRu/analytics-layer/blob/master/src/layer.js).

## Examples

After [setup](#setup) you can access the metrika through `this.$ym` instance in any component you need.

```js
export default {
  mounted () {
    this.$ym.pushAll( 'reachGoal', 'event-name', params );
  }
}
```

Or you can send to a specific counter ID

```js
export default {
  mounted () {
    this.$ym.pushTo( 1234xxxx, 'reachGoal', 'event-name', params );
  }
}
```

## License

MIT

## Author

Alexander Belov (c) 2019
