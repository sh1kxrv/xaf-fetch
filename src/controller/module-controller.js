import { Logger } from './log-controller'

/**
 * Контроллер модулей
 * @class
 */
export class ModuleController {
  /**
   * Инициализация модулей
   */
  init() {
    this.#modules.forEach((m) => m.install())
  }

  /**
   * Получить модуль по имени
   * @param {string} name
   * @returns {XafModule | null}
   */
  get(name) {
    return this.#modules.find((m) => m.name === name)
  }

  /**
   *
   * @param {string} name - имя модуля
   * @returns {boolean}
   */
  exists(name) {
    return this.#modules.includes((m) => m.name === name)
  }

  /**
   * Добавить новый модуль
   * @param {!XafModule} module
   */
  add(module) {
    if (!module || this.exists(module.name)) return
    this.#modules.push(module)
  }

  /**
   * Заморозить изменение модулей
   * ( оптимизация, просчёт приоритетов и pipeline'ов )
   */
  freeze() {
    if (this.isFrozen) {
      console.warn('Modules already freezed!')
      return
    }

    const modulesClone = [...this.#modules]
    this.#prefetchModules = modulesClone.filter(
      (m) => m.moduleOptions.pipeline === 'prefetch'
    )
    this.#postfetchModules = modulesClone.filter(
      (m) => m.moduleOptions.pipeline === 'postfetch'
    )
    this.#prefetchModules.sort(this.#prioritySort)
    this.#postfetchModules.sort(this.#prioritySort)
    this.isFrozen = true
  }

  /**
   * @param {'prefetch'|'postfetch'} pipeline
   * @param {*} options
   */
  async execute(
    pipeline = 'prefetch',
    options,
    responseData = null,
    response = null
  ) {
    switch (pipeline) {
      case 'prefetch':
        await this.#executeModules(
          this.#prefetchModules,
          options,
          response,
          responseData
        )
        break
      case 'postfetch':
        await this.#executeModules(
          this.#postfetchModules,
          options,
          response,
          responseData
        )
        break
      default:
        throw Error(`Pipeline '${pipeline}' not defined`)
    }
  }

  /**
   *
   * @param {XafModule[]} modules
   */
  async #executeModules(
    modules,
    options,
    response = null,
    responseData = null
  ) {
    for (let module of modules) {
      await module.execute(options, response, responseData)
    }
  }

  #prioritySort({ moduleOptions: moA }, { moduleOptions: moB }) {
    if (moA.priority > moB.priority) return 1
    else if (moA.priority < moB.priority) return -1
    return 0
  }

  /**
   * @private
   * @type {XafModule[]}
   */
  #modules = []

  /**
   * Prefetch-Модули
   * @private
   * @type {XafModule[]}
   */
  #prefetchModules = []

  /**
   * Postfetch-Модули
   * @private
   * @type {XafModule[]}
   */
  #postfetchModules = []

  /**
   * @type {boolean}
   */
  isFrozen = false
}
