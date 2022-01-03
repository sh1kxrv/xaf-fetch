import _ from './abstract'
import { ModuleController } from './controller/module-controller'
import { Logger, setDebug } from './controller/log-controller'
import { RouteFactory } from './utils/route-utils'
import { PostCacheModule, PreCacheModule } from './modules/cache-module'

/**
 * Advanced Fetch
 */
export class XafFetch {
  /**
   * @param {XafOptions} options
   */
  constructor({ isDev = false, cache, api_url }) {
    this.#cacheOpts = cache
    this.#modules = new ModuleController()
    this.api_url = api_url
    setDebug(isDev)
  }

  /**
   * Метод инициализация фетча
   */
  initialize() {
    if (this.#cacheOpts.enabled) {
      this.#modules.add(new PreCacheModule(this.#cacheOpts))
      this.#modules.add(new PostCacheModule(this.#cacheOpts))
    }
    this.#modules.init()
    this.#modules.freeze()
  }

  /**
   * Глобальная надстройка fetch
   * @param {XFXOptions} fetchOptions
   * @returns {FetchResponse<any>}
   */
  async request(fetchOptions = {}) {
    let isCancelled = false
    fetchOptions.cancel = () => (isCancelled = true)
    fetchOptions.isCanceled = () => isCancelled

    this.#validateOptions(fetchOptions)

    await this.#modules.execute('prefetch', fetchOptions)

    // Если фетч был отменён
    if (isCancelled) {
      return this.wrapResponse(fetchOptions.overrideObject)
    }

    return (async () => {
      const resp = await fetch(fetchOptions.url, fetchOptions)
      const json = await resp.json()
      await this.#modules.execute('postfetch', fetchOptions, json, resp)

      return this.wrapResponse(json)
    })()
  }

  /**
   * GET-Request
   * @param {string} url
   * @param {*} headers
   * @returns {Promise<FetchResponse>}
   */
  get(url, headers = {}, { cacheForce = false, cacheExclude = false } = {}) {
    headers = this.headersCache(headers, cacheForce, cacheExclude)
    return this.request({ method: 'GET', url, headers })
  }

  /**
   * POST-Request
   * @param {string} url
   * @param {*} headers
   * @param {*} body
   * @returns {Promise<FetchResponse>}
   */
  post(
    url,
    body = null,
    headers = {},
    { cacheForce = false, cacheExclude = false } = {}
  ) {
    headers = this.headersCache(headers, cacheForce, cacheExclude)
    return this.request({ method: 'POST', url, headers, body })
  }

  /**
   * PUT-Request
   * @param {string} url
   * @param {*} headers
   * @param {*} body
   * @returns {Promise<FetchResponse>}
   */
  put(
    url,
    body = null,
    headers = {},
    { cacheForce = false, cacheExclude = false } = {}
  ) {
    headers = this.headersCache(headers, cacheForce, cacheExclude)
    return this.request({ method: 'PUT', url, headers, body })
  }

  /**
   * DELETE-Request
   * @param {string} url
   * @param {*} headers
   * @param {*} body
   * @returns {Promise<FetchResponse>}
   */
  delete(
    url,
    body = null,
    headers = {},
    { cacheForce = false, cacheExclude = false } = {}
  ) {
    headers = this.headersCache(headers, cacheForce, cacheExclude)
    return this.request({ method: 'DELETE', url, headers, body })
  }

  /**
   * HEAD-Request
   * @param {string} url
   * @param {*} headers
   * @param {*} body
   * @returns {Promise<FetchResponse>}
   */
  head(url, headers = {}, { cacheForce = false, cacheExclude = false } = {}) {
    headers = this.headersCache(headers, cacheForce, cacheExclude)
    return this.request({ method: 'HEAD', url, headers, body })
  }

  /**
   * Подключение модулей
   * @param {XafModule} module
   */
  use(module) {
    if (this.#modules.isFreezed) {
      console.warn('Modules is freezed. `use` canceled!')
      return
    }
    if (this.#modules.exists(module.name))
      throw Error(`Module '${module.name}' already exists!`)
    this.#modules.add(module)
  }

  /**
   * Сгенерировать рут
   * @param {string} route
   * @param {string} url
   * @returns {RouteFactory}
   */
  route(route, url = this.api_url) {
    return RouteFactory.route(url, route)
  }

  headersCache(headers, cacheForce = false, cacheExclude = false) {
    if (cacheForce) headers['Force-Cache-Control'] = 'force'
    if (cacheExclude) headers['Cache-Control'] = 'no-cache'
    return headers
  }

  /**
   * Валидация настроек
   * @param {XFXOptions} options
   */
  #validateOptions(options) {
    if (!options.headers) options.headers = {}
    if (options.method !== 'GET') options.body = {}
  }

  /**
   * Внедряется в Response и добавляет функцию 'ok'
   */
  wrapResponse(responseData) {
    responseData.ok = () => responseData.status === 'OK'
    return responseData
  }

  /**
   * @private
   * @type {CacheOptions}
   */
  #cacheOpts = {
    enabled: true,
    ttd: 15 * 60 * 1000, // -> 15 min
  }

  /**
   * @private
   * @type {ModuleController}
   */
  #modules = null

  api_url = ''
}
