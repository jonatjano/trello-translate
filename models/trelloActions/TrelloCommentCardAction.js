import TrelloAction, {TrelloActionBoardResume, TrelloActionCardResume, TrelloActionListResume} from "./TrelloAction.js";

/**
 * @implements {JSONable}
 */
export default class TrelloCommentCardAction extends TrelloAction {
    /** @type {TrelloCommentCardActionData} */
    data
    /** @type {"commentCard"} */
    type

    fromJSON(value) {
        super.fromJSON(value)
        this.data = new TrelloCommentCardActionData().fromJSON(value.data)
        return this
    }
}

/**
 * @implements {JSONable}
 */
class TrelloCommentCardActionData {
    /** @type {string} */
    text
    /** @type {{emoji: Object}} */
    textData
    /** @type {TrelloActionCardResume} */
    card
    /** @type {TrelloActionListResume} */
    list
    /** @type {TrelloActionBoardResume} */
    board

    fromJSON(value) {
        this.text = value.text
        this.textData = value.textData
        this.card = new TrelloActionCardResume().fromJSON(value.card)
        this.list = new TrelloActionListResume().fromJSON(value.list)
        this.board = new TrelloActionBoardResume().fromJSON(value.board)
        return this
    }
}