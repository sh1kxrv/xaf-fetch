import localforage from "../../lib/localforage.min";

/**
 * @type {LocalForage}
 */
const $localforage = localforage;

/**
 * @typedef CachedResponse
 * @property {string} $expiration
 * @property {any} data
 * @property {string} status
 */

/**
 * @callback CacheCallback
 * @param {CachedResponse | null} cache
 * @returns {Promise<CachedResponse>}
 */

/**
 * Controllable-Cache System
 */
class OfflineCacheController {
  constructor() {
    this.#offlineDB = $localforage.createInstance({
      driver: $localforage.INDEXEDDB,
      name: "offline-storage",
    });
  }

  /**
   * @param {string} key
   * @returns {Promise<any>}
   */
  get(key) {
    return this.#offlineDB.getItem(key);
  }

  /**
   * @param {string} key
   * @param {any} value
   * @returns {Promise<any>}
   */
  set(key, value) {
    return this.#offlineDB.setItem(key, value);
  }

  /**
   * @param {string} key
   * @returns {Promise<void>}
   */
  remove(key) {
    return this.#offlineDB.removeItem(key);
  }

  /**
   * @type {LocalForage}
   */
  #offlineDB = null;
}

const CacheController = new OfflineCacheController();
export { CacheController };
