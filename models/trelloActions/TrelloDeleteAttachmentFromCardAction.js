import TrelloAction, {
    TrelloActionAttachmentResume,
    TrelloActionBoardResume, TrelloActionCardResume,
    TrelloActionListChangesResume,
    TrelloActionListResume
} from "./TrelloAction.js";


export default class TrelloDeleteAttachmentFromCardAction extends TrelloAction {
    /** @type {TrelloDeleteAttachmentFromCardActionData} */
    data
    /** @type {"deleteAttachmentFromCard"} */
    type

    fromJSON(value) {
        super.fromJSON(value)
        this.data = new TrelloDeleteAttachmentFromCardActionData().fromJSON(value.data)
        return this
    }
}

/**
 * @implements {JSONable}
 */
class TrelloDeleteAttachmentFromCardActionData {
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