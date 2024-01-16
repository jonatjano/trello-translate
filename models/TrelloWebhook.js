import {asTrelloId} from "./trelloModels.js";

/**
 * @implements {JSONable}
 */
export default class TrelloWebhook {
    /** @type {TrelloId} */
    id
    /** @type {string} */
    description
    /** @type {TrelloId} */
    idModel
    /** @type {URL} */
    callbackURL
    /** @type {boolean} */
    active
    /** @type {number} */
    consecutiveFailures
    /** @type {?Date} */
    firstConsecutiveFailDate

    /**
     * @param {Object} value
     * @return {this}
     */
    fromJSON(value) {
        this.id = asTrelloId(value.id)
        this.description = value.description
        this.idModel = asTrelloId(value.id)
        this.callbackURL = new URL(value.callbackURL)
        this.active = value.active
        this.consecutiveFailures = value.consecutiveFailures
        this.firstConsecutiveFailDate = new Date(value.firstConsecutiveFailDate)
        return this
    }
}