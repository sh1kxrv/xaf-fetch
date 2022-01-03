import { XafModule } from './xaf-module'
import { CacheController } from '../controller/cache-controller'

export class PreCacheModule extends XafModule {
  /**
   * @param {CacheOptions} options
   */
  constructor(options) {
    super('precache-module', { pipeline: 'prefetch', priority: -1 }, options)
  }
  async cachedData(requestUrl, requestBody) {
    const cached = await CacheController.get(`${requestUrl}${requestBody}`)
    if (cached) {
      const { $expiration } = cached
      const parsedDate = new Date(Date.parse($expiration))
      if (parsedDate > new Date()) {
        delete cached.$expiration
        return cached
      }
    }
  }
  /**
   * @param {XFXOptions} options
   */
  async execute(options) {
    const force = options.headers['Force-Cache-Control'] === 'force'
    const exclude = options.headers['Cache-Control'] === 'no-cache'

    const cached = await this.cachedData(
      options.url,
      JSON.stringify(options.body ?? {})
    )
    if (cached && !force && !exclude) {
      options.cancel()
      options.overrideObject = cached
    }
  }
}

export class PostCacheModule extends XafModule {
  /**
   * @param {CacheOptions} options
   */
  constructor(options) {
    super('postcache-module', { pipeline: 'postfetch', priority: -1 }, options)
  }
  install() {}

  expirationDate() {
    const expDate = new Date()
    expDate.setMilliseconds(expDate.getMilliseconds() + this.options.ttd)
    return expDate.toISOString()
  }

  /**
   * @param {XFXOptions} options
   * @param {Response} response
   */
  async execute(options, response, responseData) {
    const exclude = options.headers['Cache-Control'] === 'no-cache'
    if (response.status !== 200 || responseData.status !== 'OK' || exclude)
      return

    const clonedResponse = { ...responseData }
    clonedResponse.$expiration = this.expirationDate()
    const textBody = JSON.stringify(options.body ?? {})
    CacheController.set(`${options.url}${textBody}`, clonedResponse)
  }
}
