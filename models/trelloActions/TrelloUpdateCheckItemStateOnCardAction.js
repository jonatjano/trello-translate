import TrelloAction, {
    TrelloActionBoardResume,
    TrelloActionCardResume,
    TrelloActionChecklistResume,
    TrelloActionChecklistItemResume
} from "./TrelloAction.js";


export default class TrelloUpdateCheckItemStateOnCardAction extends TrelloAction {
    /** @type {TrelloUpdateCheckItemStateOnCardActionData} */
    data
    /** @type {"updateChecklistItemStateOnCard"} */
    type

    fromJSON(value) {
        super.fromJSON(value)
        this.data = new TrelloUpdateCheckItemStateOnCardActionData().fromJSON(value.data)
        return this
    }
}

/**
 * @implements {JSONable}
 */
class TrelloUpdateCheckItemStateOnCardActionData {
    /** @type {TrelloActionBoardResume} */
    board
    /** @type {TrelloActionCardResume} */
    card
    /** @type {TrelloActionChecklistResume} */
    checklist
    /** @type {TrelloActionChecklistItemResume} */
    checkItem

    fromJSON(value) {
        this.board = new TrelloActionBoardResume().fromJSON(value.board)
        this.card = new TrelloActionCardResume().fromJSON(value.card)
        this.checklist = new TrelloActionChecklistResume().fromJSON(value.checklist)
        this.checkItem = new TrelloActionChecklistItemResume().fromJSON(value.checkItem)
        return this
    }
}