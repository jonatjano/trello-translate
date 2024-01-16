import TrelloAction, {TrelloActionBoardResume, TrelloActionCardResume, TrelloActionListResume} from "./TrelloAction.js";

/**
 * @implements {JSONable}
 */
export default class TrelloDeleteCardAction extends TrelloAction {
    /** @type {TrelloDeleteCardActionData} */
    data
    /** @type {"deleteCard"} */
    type

    fromJSON(value) {
        super.fromJSON(value)
        this.data = new TrelloDeleteCardActionData().fromJSON(value.data)
        return this
    }
}

/**
 * @implements {JSONable}
 */
class TrelloDeleteCardActionData {
    /** @type {TrelloActionCardResume} */
    card
    /** @type {TrelloActionListResume} */
    list
    /** @type {TrelloActionBoardResume} */
    board

    fromJSON(value) {
        this.card = new TrelloActionCardResume().fromJSON(value.card)
        this.list = new TrelloActionListResume().fromJSON(value.list)
        this.board = new TrelloActionBoardResume().fromJSON(value.board)
        return this
    }
}