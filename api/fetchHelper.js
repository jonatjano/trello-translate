/**
 * @typedef {{fromJSON: (Object) => this}} JSONable
 */
// @typedef {{fromJSON: (Object) => this, toJSON: () => any}} JSONable
/**
 * @typedef {{constructor: () => JSONable}} JSONableType
 */
import * as cacheUtils from "../utils/cacheUtils.js";

/** @type {JSONable} */
export const defaultJSONable = {fromJSON: I => I, toJSON: () => undefined}

/**
 * @template {JSONableType} T
 */
export class arrayReviver {
    /** @type {T} */
    type

    /**
     * @param {T} type
     */
    constructor(type) {
        this.type = type
    }

    /**
     * @param {Object[]} value
     * @return {T[]}
     */
    fromJSON(value) {
        return value.map(val => (new this.type()).fromJSON(val))
    }

    /**
     * @param {{toJSON: () => T}} instance
     * @param {T[]} value
     * @return {Object[]}
     */
    toJSON(instance, value) {
        return value.map(test => instance.toJSON())
    }
}

/**
 * @enum {string}
 */
const HTTPMethod = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE"
}

export const obj2param = obj => Object.entries(obj)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => {
        if (value instanceof Date) {
            return `&${key}=${encodeURIComponent(value.toISOString())}`
        } else if (Array.isArray(value)) {
            return `&${key}=${encodeURIComponent(value.join(","))}`
        } else {
            return `&${key}=${encodeURIComponent(value)}`
        }
    })
    .join``

/**
 * @param {string} url
 * @param {HTTPMethod} [method]
 * @param {Object} [body]
 * @param {JSONable} type
 * @return {Promise<typeof type>}
 */
function http({url, method = HTTPMethod.GET, body = undefined, type}) {
    if (globalThis.config.verbose) {
        console.log(`${method} ${url} ${JSON.stringify(body)}`)
    }

    return fetch(url, {method, body})
        .then(async res => {
            if (res.status === 200) {
                return res.text().then(body => JSON.parse(body, (key, value) => key === "" ? type.fromJSON(value) : value))
            } else if (res.status === 429) {
                if (globalThis.config.verbose) {
                    console.log(`Received a 429: Too many requests answer, trying again in a few seconds`)
                }
                return new Promise(res => cacheUtils.saveCache().then(() => setTimeout(res, 5000)))
                    .then(() => http({url, method, body, type}))
            } else if (res.status === 456) {
                if (globalThis.config.verbose) {
                    console.log(`Received a 456: quota exceeded answer, trying again tomorrow`)
                }
                return new Promise(res => cacheUtils.saveCache().then(() => setTimeout(res, 86400000)))
                    .then(() => http({url, method, body, type}))
            } else if (res.status >= 500) {
                if (globalThis.config.verbose) {
                    console.log(`Received a ${res.status}: ${res.statusText} answer, trying again in an hour`)
                }
                return new Promise(res => cacheUtils.saveCache().then(() => setTimeout(res, 3600000)))
                    .then(() => http({url, method, body, type}))
            } else {
                throw new Error(`${res.status} ${res.statusText} ${await res.text()}`)
            }
        })
        .catch(err => console.error(err))
}

/**
 * @param {string} url
 * @param {JSONable} type
 * @return {Promise<typeof type>}
 */
export function get(url, type= defaultJSONable) {
    return http({url, type})
}

/**
 * @param {string} url
 * @param {Object} body
 * @param {JSONable} type
 * @returns {Promise<typeof type>}
 */
export function post(url, body, type= defaultJSONable) {
    return http({url, method: HTTPMethod.POST, body, type})
}

/**
 * @param {string} url
 * @param {Object} body
 * @param {JSONable} type
 * @returns {Promise<typeof type>}
 */
export function put(url, body, type= defaultJSONable) {
    return http({url, method: HTTPMethod.PUT, body, type})
}

/**
 * @param {string} url
 * @param {JSONable} type
 * @returns {Promise<typeof type>}
 */
export function delet(url, type= defaultJSONable) {
    return http({url, method: HTTPMethod.DELETE, type})
}

export const trello = {
    get(route, parameters, type) { return get(`${globalThis.trello.url}${route}?${globalThis.trello.urlParams}${parameters}`, type) },
    post(route, parameters, body, type) { return post(`${globalThis.trello.url}${route}?${globalThis.trello.urlParams}${parameters}`, body, type) },
    put(route, parameters, body, type) { return put(`${globalThis.trello.url}${route}?${globalThis.trello.urlParams}${parameters}`, body, type) },
    delet(route, type) { return delet(`${globalThis.trello.url}${route}?${globalThis.trello.urlParams}`, type) }
}