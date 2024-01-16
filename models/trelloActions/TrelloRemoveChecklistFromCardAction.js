import TrelloAction, {
    TrelloActionBoardResume,
    TrelloActionCardResume,
    TrelloActionChecklistResume,
    TrelloActionListResume
} from "./TrelloAction.js";

/**
 * @implements {JSONable}
 */
export default class TrelloRemoveChecklistFromCardAction extends TrelloAction {
    /** @type {TrelloRemoveChecklistFromCardActionData} */
    data
    /** @type {"removeChecklistFromCard"} */
    type

    fromJSON(value) {
        super.fromJSON(value)
        this.data = new TrelloRemoveChecklistFromCardActionData().fromJSON(value.data)
        return this
    }
}

/**
 * @implements {JSONable}
 */
class TrelloRemoveChecklistFromCardActionData {
    /** @type {TrelloActionCardResume} */
    card
    /** @type {TrelloActionChecklistResume} */
    checklist
    /** @type {TrelloActionBoardResume} */
    board

    fromJSON(value) {
        this.card = new TrelloActionCardResume().fromJSON(value.card)
        this.checklist = new TrelloActionChecklistResume().fromJSON(value.checklist)
        this.board = new TrelloActionBoardResume().fromJSON(value.board)
        return this
    }
}