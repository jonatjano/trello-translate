import TrelloAction, {TrelloActionBoardResume, TrelloActionCardResume, TrelloActionListResume} from "./TrelloAction.js";

/**
 * @implements {JSONable}
 */
export default class TrelloCreateCardAction extends TrelloAction {
    /** @type {TrelloCreateCardActionData} */
    data
    /** @type {"createCard"} */
    type

    fromJSON(value) {
        super.fromJSON(value)
        this.data = new TrelloCreateCardActionData().fromJSON(value.data)
        return this
    }
}

/**
 * @implements {JSONable}
 */
class TrelloCreateCardActionData {
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