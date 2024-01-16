import TrelloAction, {TrelloActionBoardResume, TrelloActionListResume} from "./TrelloAction.js";

/**
 * @implements {JSONable}
 */
export default class TrelloCreateListAction extends TrelloAction {
    /** @type {TrelloCreateListActionData} */
    data
    /** @type {"createList"} */
    type

    fromJSON(value) {
        super.fromJSON(value)
        this.data = new TrelloCreateListActionData().fromJSON(value.data)
        return this
    }
}

/**
 * @implements {JSONable}
 */
class TrelloCreateListActionData {
    /** @type {TrelloActionListResume} */
    list
    /** @type {TrelloActionBoardResume} */
    board

    fromJSON(value) {
        this.list = new TrelloActionListResume().fromJSON(value.list)
        this.board = new TrelloActionBoardResume().fromJSON(value.board)
        return this
    }
}