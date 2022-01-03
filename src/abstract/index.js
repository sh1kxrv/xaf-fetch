/**
 * Настройки кэша
 * @typedef CacheOptions
 * @property {boolean} enabled
 * @property {number} ttd - время, после которого кэш-запрос будет удалён и заново запрошен
 */

/**
 * Настройки автобилдера рутов
 * @typedef RouteAutoBuilderOptions
 * @property {boolean} enabled
 * @property {string} api - ссылка на API
 */

/**
 * Общие настройки
 * @typedef XafOptions
 * @property {boolean} isDev
 * @property {string} api_url
 * @property {CacheOptions} cache
 * @property {RouteAutoBuilderOptions} routeBuilder - ссылка на API
 */

/**
 * @typedef RouteOptions
 * @property {?string} url
 * @property {string} route
 * @property {string} path
 */

/**
 * Отмены выполнения фетча ( доступно только в prefetch )
 * @name CancelFunction
 * @function
 */

/**
 * @name IsCancelledFunction
 * @function
 * @returns {boolean}
 */

/**
 * Настройки запроса
 * @typedef XFXOptions
 * @property {string | RouteOptions} url
 * @property {'GET'|'HEAD'|'POST'|'PUT'|'DELETE'|'CONNECT'|'OPTIONS'|'TRACE'|'PATCH'} method
 * @property {object} headers
 * @property {object} body
 * @property {CancelFunction} cancel - отмена фетча
 * @property {IsCancelledFunction} isCancelled - проверить состояние isCanceled
 * @property {*} overrideObject - возвращается в случае отмены фетча
 */

// Модули

/**
 * @name InstallFunction
 * @function
 */

/**
 * @name ExecuteFunction
 * @function
 * @param {*} options
 */

/**
 * @typedef ModuleOptions
 * @property {!'prefetch'|'postfetch'} pipeline
 * @property {number} priority
 */

/**
 * @typedef XafModule
 * @property {InstallFunction} install - метод установки модуля
 * @property {ExecuteFunction} execute - исполнение модуля
 * @property {string} name - имя модуля
 * @property {ModuleOptions} moduleOptions
 */

// Fetch

/**
 * @template FetchData
 * @typedef {object} FetchResponse
 * @property {FetchData} data
 * @property {boolean} ok - если подключен модуль 'ok-module'
 * @property {?number | null} code - server error code
 * @property {?string | null} description - server error description
 */
