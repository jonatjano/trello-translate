import TrelloAction, {
    TrelloActionBoardResume,
    TrelloActionCardResume,
    TrelloActionChecklistResume,
    TrelloActionListResume
} from "./TrelloAction.js";

/**
 * @implements {JSONable}
 */
export default class TrelloAddChecklistToCardAction extends TrelloAction {
    /** @type {TrelloAddChecklistToCardActionData} */
    data
    /** @type {"addChecklistToCard"} */
    type

    fromJSON(value) {
        super.fromJSON(value)
        this.data = new TrelloAddChecklistToCardActionData().fromJSON(value.data)
        return this
    }
}

/**
 * @implements {JSONable}
 */
class TrelloAddChecklistToCardActionData {
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