export class RouteFactory {
  /**
   * @param {string} route
   */
  constructor(route) {
    this.route = route
  }

  /**
   *
   * @param {string} path
   * @returns {string}
   */
  path(path) {
    return `${this.route}/${path}`
  }

  /**
   * @type {string | null}
   */
  route = null

  /**
   * @param {string} route
   * @returns {RouteFactory}
   */
  static route(url, route) {
    return new RouteFactory(`${url}/${route}`)
  }
}
