import TrelloAction, {
    TrelloActionBoardResume, TrelloActionCardChangesResume,
    TrelloActionCardResume,
    TrelloActionListResume
} from "./TrelloAction.js";

/**
 * @implements {JSONable}
 */
export default class TrelloUpdateCardAction extends TrelloAction {
    /** @type {TrelloUpdateCardActionData} */
    data
    /** @type {"updateCard"} */
    type

    fromJSON(value) {
        super.fromJSON(value)
        this.data = new TrelloUpdateCardActionData().fromJSON(value.data)
        return this
    }
}

/**
 * @implements {JSONable}
 */
class TrelloUpdateCardActionData {
    /** @type {TrelloActionCardResume} */
    card
    /** @type {TrelloActionCardChangesResume} */
    old
    /** @type {?TrelloActionListResume} */
    list
    /** @type {?TrelloActionListResume} */
    listAfter
    /** @type {?TrelloActionListResume} */
    listBefore
    /** @type {TrelloActionBoardResume} */
    board

    fromJSON(value) {
        this.card = new TrelloActionCardResume().fromJSON(value.card)
        this.old = new TrelloActionCardChangesResume().fromJSON(value.old)
        this.list = value.list ? new TrelloActionListResume().fromJSON(value.list) : undefined
        this.listAfter = value.listAfter ? new TrelloActionListResume().fromJSON(value.listAfter) : undefined
        this.listBefore = value.listBefore ? new TrelloActionListResume().fromJSON(value.listBefore) : undefined
        this.board = new TrelloActionBoardResume().fromJSON(value.board)
        return this
    }
}