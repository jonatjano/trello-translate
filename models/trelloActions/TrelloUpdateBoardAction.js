import TrelloAction, {
    TrelloActionBoardChangesResume,
    TrelloActionBoardResume
} from "./TrelloAction.js";

/**
 * @implements {JSONable}
 */
export default class TrelloUpdateBoardAction extends TrelloAction {
    /** @type {TrelloUpdateBoardActionData} */
    data
    /** @type {"updateBoard"} */
    type

    fromJSON(value) {
        super.fromJSON(value)
        this.data = new TrelloUpdateBoardActionData().fromJSON(value.data)
        return this
    }
}

/**
 * @implements {JSONable}
 */
class TrelloUpdateBoardActionData {
    /** @type {TrelloActionBoardChangesResume} */
    old
    /** @type {TrelloActionBoardResume} */
    board

    fromJSON(value) {
        this.old = new TrelloActionBoardChangesResume().fromJSON(value.old)
        this.board = new TrelloActionBoardResume().fromJSON(value.board)
        return this
    }
}