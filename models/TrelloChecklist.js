import {asTrelloId} from "./trelloModels.js";
import TrelloLimits from "./TrelloLimits.js";

export default class TrelloChecklist {
    /** @type {TrelloId} */
    id
    /** @type {string} */
    name
    /** @type {TrelloId} */
    idBoard
    /** @type {TrelloId} */
    idCard
    /** @type {TrelloPos} */
    pos
    /** @type {TrelloChecklistItem[]} */
    checkItems

    fromJSON(value) {
        this.id = asTrelloId(value.id)
        this.name = value.name
        this.idBoard = asTrelloId(value.idBoard)
        this.idCard = asTrelloId(value.idCard)
        this.pos = value.pos
        this.checkItems = value.checkItems?.map(val => new TrelloChecklistItem().fromJSON(val))
        return this
    }
}

export class TrelloChecklistItem {
    /** @type {TrelloId} */
    id
    /** @type {string} */
    name
    /** @type {{emoji: Object}} */
    nameData
    /** @type {TrelloPos} */
    pos
    /** @type {"complete" | "incomplete"} */
    state
    /** @type {?any} */
    creationMethod
    /** @type {?Date} */
    due
    /** @type {?Date} */
    dueReminder
    /** @type {?TrelloId} */
    idMember
    /** @type {TrelloId} */
    idChecklist

    fromJSON(value) {
        this.id = asTrelloId(value.id)
        this.name = value.name
        this.nameData = value.nameData
        this.pos = value.pos
        this.state = value.state
        this.creationMethod = value.creationMethod
        this.due = new Date(value.due)
        this.dueReminder = new Date(value.dueReminder)
        this.idMember = asTrelloId(value.idMember)
        this.idChecklist = asTrelloId(value.idChecklist)
        return this
    }
}