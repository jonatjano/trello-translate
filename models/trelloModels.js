/**
 * @typedef {string} TrelloId
 * /^[0-9a-fA-F]{24}$/
 */
/**
 * @typedef {"pirate" | "regular"} TrelloCardAging
 */

/**
 * @param {string} id
 * @return {TrelloId | false}
 */
export function asTrelloId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id) ? id : false
}

/**
 * @typedef {number | "top" | "bottom"} TrelloPos
 */

/** @enum {string} */
export const getListFilter = {
    all: "all",
    closed: "closed",
    open: "open",
    none: "none"
}

export const TrelloColor = {
    yellow: "yellow",
    purple: "purple",
    blue: "blue",
    red: "red",
    green: "green",
    orange: "orange",
    black: "black",
    sky: "sky",
    pink: "pink",
    lime: "lime"
}

export class TrelloLabel {
    /** @type {TrelloId} */
    id
    /** @type {TrelloId} */
    idBoard
    /** @type {string} */
    name
    /** @type {?TrelloColor} */
    color

    fromJSON(value) {
        this.id = asTrelloId(value.id)
        this.idBoard = asTrelloId(value.idBoard)
        this.name = value.name ?? ""
        this.color = value.color
        return this
    }
}