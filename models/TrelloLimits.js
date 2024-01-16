
/**
 * @implements {JSONable}
 */
export default class TrelloLimits {
    /** @type {{perBoard: TrelloLimitsObject}} */
    attachments

    /**
     * @param {Object} value
     * @return {this}
     */
    fromJSON(value) {
        this.attachments = value.attachments ? {perBoard: new TrelloLimitsObject().fromJSON(value.attachments.perBoard)} : null
        return this
    }

    /**
     * @return {Object}
     */
    toJSON() {
        return { attachments: this.attachments }
    }
}

/**
 * @implements {JSONable}
 */
class TrelloLimitsObject {
    /** @type {"ok" | "warning"} */
    status
    /** @type {number} */
    disableAt
    /** @type {number} */
    warnAt

    /**
     * @param {Object} value
     * @return {this}
     */
    fromJSON(value) {
        this.status = value.status
        this.disableAt = value.disableAt
        this.warnAt = value.warnAt
        return this
    }

    /**
     * @return {Object}
     */
    toJSON() {
        return { status: this.status, disableAt: this.disableAt, warnAt: this.warnAt }
    }
}