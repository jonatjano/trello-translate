import TrelloAction, {
    TrelloActionBoardResume,
    TrelloActionListChangesResume,
    TrelloActionListResume
} from "./TrelloAction.js";


export default class TrelloUpdateListAction extends TrelloAction {
    /** @type {TrelloUpdateListActionData} */
    data
    /** @type {"updateList"} */
    type

    fromJSON(value) {
        super.fromJSON(value)
        this.data = new TrelloUpdateListActionData().fromJSON(value.data)
        return this
    }
}

/**
 * @implements {JSONable}
 */
class TrelloUpdateListActionData {
    /** @type {TrelloActionListResume} */
    list
    /** @type {TrelloActionListChangesResume} */
    old
    /** @type {TrelloActionBoardResume} */
    board

    fromJSON(value) {
        this.list = new TrelloActionListResume().fromJSON(value.list)
        this.old = new TrelloActionListChangesResume().fromJSON(value.old)
        this.board = new TrelloActionBoardResume().fromJSON(value.board)
        return this
    }
}