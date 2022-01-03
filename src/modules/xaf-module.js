/**
 * Абстрактный уровень | Модули для fetch
 * @class
 */
export class XafModule {
  /**
   * @param {string} name
   * @param {ModuleOptions} moduleOptions
   * @param {*} options
   */
  constructor(name, moduleOptions = {}, options = {}) {
    this.name = name
    this.options = options
    this.moduleOptions = moduleOptions
    if (!this.moduleOptions.pipeline)
      throw Error(`Module '${name}' have not pipeline`)
  }
  install() {}

  /**
   * @param {XFXOptions} options
   * @param {...any} args
   */
  execute(options, ...args) {}
  /**
   * @type {ModuleOptions}
   */
  moduleOptions = {
    priority: 0,
    pipeline: null,
  }
}
