import { Logger } from '../controller/log-controller'
import { XafModule } from './xaf-module'

export class RequiresTokenModule extends XafModule {
  constructor(options) {
    super(
      'requires-token-module',
      { pipeline: 'prefetch', priority: 6 },
      options
    )
  }
  /**
   * @param {XFXOptions} options
   */
  execute(options) {
    if (options.reqToken && !options.token) {
      Logger.info(`Token in request ${options.url} is required!`)
    }
  }
}
