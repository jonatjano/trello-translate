import TrelloAction, {
    TrelloActionBoardResume,
    TrelloActionCardResume, TrelloActionChecklistChangesResume,
    TrelloActionChecklistResume,
    TrelloActionListResume
} from "./TrelloAction.js";

/**
 * @implements {JSONable}
 */
export default class TrelloUpdateChecklistAction extends TrelloAction {
    /** @type {TrelloUpdateChecklistActionData} */
    data
    /** @type {"updateChecklist"} */
    type

    fromJSON(value) {
        super.fromJSON(value)
        this.data = new TrelloUpdateChecklistActionData().fromJSON(value.data)
        return this
    }
}

/**
 * @implements {JSONable}
 */
class TrelloUpdateChecklistActionData {
    /** @type {TrelloActionChecklistChangesResume} */
    old
    /** @type {TrelloActionChecklistResume} */
    checklist
    /** @type {TrelloActionBoardResume} */
    board

    fromJSON(value) {
        this.old = new TrelloActionChecklistChangesResume().fromJSON(value.old)
        this.checklist = new TrelloActionChecklistResume().fromJSON(value.checklist)
        this.board = new TrelloActionBoardResume().fromJSON(value.board)
        return this
    }
}