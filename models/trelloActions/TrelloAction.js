import {asTrelloId} from "../trelloModels.js";
import TrelloMember from "../TrelloMember.js";
import TrelloLimits from "../TrelloLimits.js";
import {TrelloPrefs} from "../TrelloBoard.js";

/**
 * @implements {JSONable}
 */
export default class TrelloAction {
    /** @type {TrelloId} */
    id
    /** @type {TrelloId} */
    idMemberCreator
    /** @type {Object} */
    data
    /** @type {?any} */
    appCreator
    /** @type {
     * "updateBoard" | "addMemberToBoard" | "addMemberToCard" | "removeMemberFromCard" |
     * "createList" | "updateList" |
     * "addToOrganizationBoard" |
     * "createCard" | "updateCard" | "deleteCard" |
     * "addChecklistToCard" | "updateChecklist" | "updateCheckItemStateOnCard" | "convertToCardFromCheckItem" | "removeChecklistFromCard" |
     * "commentCard" | "addAttachmentToCard" | "deleteAttachmentFromCard" |
     * "enablePlugin"
     * } */
    type
    /** @type {Date} */
    date
    /** @type {?TrelloLimits} */
    limits
    /** @type {Object} */
    display
    /** @type {TrelloMember} */
    memberCreator

    /**
     * @param {Object} value
     * @return {this}
     */
    fromJSON(value) {
        if (value instanceof TrelloAction) {
            this.id = value.id
            this.idMemberCreator = value.idMemberCreator
            this.date = value.date
            this.limits = value.limits
            this.memberCreator = value.memberCreator
        } else {
            this.id = asTrelloId(value.id)
            this.idMemberCreator = asTrelloId(value.idMemberCreator)
            this.date = new Date(value.date)
            this.limits = value.limits ? new TrelloLimits().fromJSON(value.limits) : null
            this.memberCreator = value.memberCreator ? new TrelloMember().fromJSON(value.memberCreator) : value.memberCreator
        }
        this.data = value.data
        this.appCreator = value.appCreator
        this.type = value.type
        this.display = value.display
        return this
    }
}

export class TrelloActionListResume {
    /** @type {TrelloId} */
    id
    /** @type {string} */
    name
    /** @type {?boolean} */
    closed
    /** @type {?TrelloPos} */
    pos

    fromJSON(value) {
        this.id = asTrelloId(value.id)
        this.name = value.name
        this.closed = value.closed
        this.pos = value.pos
        return this
    }
}

export class TrelloActionBoardResume {
    /** @type {TrelloId} */
    id
    /** @type {string} */
    name
    /** @type {?desc} */
    desc
    /** @type {?boolean} */
    closed
    /** @type {string} */
    shortLink
    /** @type {?TrelloPrefs} */
    prefs
    /** @type {?{green: string, yellow: string, orange: string, red: string, purple: string, blue: string, sky: string, lime: string, pink: string, black: string}} */
    labelNames

    fromJSON(value) {
        this.id = asTrelloId(value.id)
        this.name = value.name
        this.shortLink = value.shortLink
        this.desc = value.desc
        this.closed = value.closed
        this.prefs = value.prefs ? new TrelloPrefs().fromJSON(value.prefs) : undefined
        this.labelNames = value.labelNames
        return this
    }
}

export class TrelloActionCardResume {
    /** @type {TrelloId} */
    id
    /** @type {string} */
    name
    /** @type {string} */
    desc
    /** @type {?TrelloPos} */
    pos
    /** @type {number} */
    idShort
    /** @type {?TrelloId} */
    idLabels
    /** @type {string} */
    shortLink
    /** @type {boolean} */
    closed
    /** @type {?TrelloId} */
    idAttachmentCover

    fromJSON(value) {
        this.id = asTrelloId(value.id)
        this.name = value.name
        this.desc = value.desc
        this.pos = value.pos
        this.idShort = value.idShort
        this.shortLink = value.shortLink
        this.idLabels = value.idLabels?.flat(9).filter(a=>a)
        this.closed = value.closed
        this.idAttachmentCover = value.idAttachmentCover ? asTrelloId(value.idAttachmentCover) : undefined
        return this
    }
}

export class TrelloActionChecklistResume {
    /** @type {TrelloId} */
    id
    /** @type {string} */
    name

    fromJSON(value) {
        this.id = asTrelloId(value.id)
        this.name = value.name
        return this
    }
}

export class TrelloActionListChangesResume {
    /** @type {?string} */
    name
    /** @type {?boolean} */
    closed
    /** @type {?TrelloPos} */
    pos

    fromJSON(value) {
        this.name = value.name
        this.closed = value.closed
        this.pos = value.pos
        return this
    }
}


export class TrelloActionCardChangesResume {
    /** @type {?string} */
    name
    /** @type {?string} */
    desc
    /** @type {?boolean} */
    closed
    /** @type {?TrelloPos} */
    pos
    /** @type {?TrelloId} */
    idList
    /** @type {?TrelloId[]} */
    idLabels
    /** @type {?TrelloId} */
    idAttachmentCover
    /** @type {Object} */
    unparsed

    fromJSON(value) {
        this.name = value.name
        this.desc = value.desc
        this.closed = value.closed
        this.pos = value.pos
        this.idList = value.idList
        this.idLabels = value.idLabels?.flat(9).filter(a=>a)
        this.idAttachmentCover = asTrelloId(value.idAttachmentCover)
        this.unparsed = value
        return this
    }
}

export class TrelloActionChecklistItemResume {
    /** @type {TrelloId} */
    id
    /** @type {string} */
    name
    /** @type {"complete" | "incomplete"} */
    state
    /** @type {{emoji: Object}} */
    textData

    fromJSON(value) {
        this.id = asTrelloId(value.id)
        this.name = value.name
        this.state = value.state
        this.textData = value.textData
        return this
    }
}

export class TrelloActionBoardChangesResume {
    /** @type {?string} */
    name
    /** @type {?string} */
    desc
    /** @type {?boolean} */
    closed
    /** @type {?TrelloPrefs} */
    prefs
    /** @type {?{green: string, yellow: string, orange: string, red: string, purple: string, blue: string, sky: string, lime: string, pink: string, black: string}} */
    labelNames
    /** @type {Object} */
    unparsed

    fromJSON(value) {
        this.name = value.name
        this.desc = value.desc
        this.closed = value.closed
        this.prefs = value.prefs ? new TrelloPrefs().fromJSON(value.prefs) : undefined
        this.labelNames = value.labelNames
        this.unparsed = value
        delete this.unparsed.name
        delete this.unparsed.desc
        delete this.unparsed.closed
        delete this.unparsed.prefs
        delete this.unparsed.labelNames
        return this
    }
}

export class TrelloActionAttachmentResume {
    /** @type {string} */
    url
    /** @type {string} */
    name
    /** @type {TrelloId} */
    id
    /** @type {string} */
    previewUrl
    /** @type {string} */
    previewUrl2x

    fromJSON(value) {
        this.url = value.url
        this.name = value.name
        this.id = asTrelloId(value.id)
        this.previewUrl = value.previewUrl
        this.previewUrl2x = value.previewUrl2x
        return this
    }
}


export class TrelloActionChecklistChangesResume {
    /** @type {?string} */
    name
    /** @type {Object} */
    unparsed

    fromJSON(value) {
        this.name = value.name
        this.unparsed = value
        return this
    }
}