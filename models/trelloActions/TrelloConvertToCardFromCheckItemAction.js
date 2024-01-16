import TrelloAction, {
    TrelloActionBoardResume,
    TrelloActionCardResume,
    TrelloActionChecklistResume,
    TrelloActionListResume
} from "./TrelloAction.js";

export default class TrelloConvertToCardFromCheckItemAction extends TrelloAction {
    /** @type {TrelloConvertToCardFromCheckItemActionData} */
    data
    /** @type {"convertToCardFromCheckItem"} */
    type

    fromJSON(value) {
        super.fromJSON(value)
        this.data = new TrelloConvertToCardFromCheckItemActionData().fromJSON(value.data)
        return this
    }
}

class TrelloConvertToCardFromCheckItemActionData {
    /** @type {TrelloActionCardResume} */
    cardSource
    /** @type {TrelloActionListResume} */
    list
    /** @type {TrelloActionBoardResume} */
    board
    /** @type {TrelloActionChecklistResume} */
    checklist
    /** @type {TrelloActionCardResume} */
    card

    fromJSON(value) {
        this.cardSource = new TrelloActionCardResume().fromJSON(value.cardSource)
        this.list = new TrelloActionListResume().fromJSON(value.list)
        this.board = new TrelloActionBoardResume().fromJSON(value.board)
        this.checklist = new TrelloActionChecklistResume().fromJSON(value.checklist)
        this.card = new TrelloActionCardResume().fromJSON(value.card)
        return this
    }
}