import TrelloAction, {
    TrelloActionAttachmentResume,
    TrelloActionBoardResume, TrelloActionCardResume,
    TrelloActionListChangesResume,
    TrelloActionListResume
} from "./TrelloAction.js";


export default class TrelloAddAttachmentToCardAction extends TrelloAction {
    /** @type {TrelloAddAttachmentToCardActionData} */
    data
    /** @type {"addAttachmentToCard"} */
    type

    fromJSON(value) {
        super.fromJSON(value)
        this.data = new TrelloAddAttachmentToCardActionData().fromJSON(value.data)
        return this
    }
}

/**
 * @implements {JSONable}
 */
class TrelloAddAttachmentToCardActionData {
    /** @type {TrelloActionAttachmentResume} */
    attachment
    /** @type {TrelloActionCardResume} */
    card
    /** @type {TrelloActionListResume} */
    list
    /** @type {TrelloActionBoardResume} */
    board

    fromJSON(value) {
        this.attachment = new TrelloActionAttachmentResume().fromJSON(value.attachment)
        this.card = new TrelloActionCardResume().fromJSON(value.card)
        this.list = value.list ? new TrelloActionListResume().fromJSON(value.list) : value.list
        this.board = new TrelloActionBoardResume().fromJSON(value.board)
        return this
    }
}