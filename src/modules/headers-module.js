import { XafModule } from './xaf-module'

export class HeadersModule extends XafModule {
  constructor(options) {
    super('headers-module', { pipeline: 'prefetch', priority: 0 }, options)
  }
  /**
   * @param {XFXOptions} options
   */
  execute(options) {
    options.headers['Content-Type'] = 'application/json; charset=utf-8'
  }
}
