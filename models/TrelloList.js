import {asTrelloId} from "./trelloModels.js";
import TrelloLimits from "./TrelloLimits.js";

export default class TrelloList {
    /** @type {TrelloId} */
    id
    /** @type {string} */
    name
    /** @type {boolean} */
    closed
    /** @type {number} */
    pos
    /** @type {string} */
    softLimit
    /** @type {string} */
    idBoard
    /** @type {boolean} */
    subscribed
    /** @type {TrelloLimits} */
    limits

    fromJSON(value) {
        this.id = asTrelloId(value.id)
        this.name = value.name
        this.closed = value.closed
        this.pos = value.pos
        this.softLimit = value.softLimit
        this.idBoard = asTrelloId(value.idBoard)
        this.subscribed = value.subscribed
        this.limits = value.limits ? new TrelloLimits().fromJSON(value.limits) : null
        return this
    }
}