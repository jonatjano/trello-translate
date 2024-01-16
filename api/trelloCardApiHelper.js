import * as fetchHelper from "./fetchHelper.js";
import TrelloCard, {TrelloAttachment} from "../models/TrelloCard.js";
import TrelloCommentCardAction from "../models/trelloActions/TrelloCommentCardAction.js";

/**
 *
 * @param {TrelloId} listId
 * @param {string} cardName
 * @param {TrelloPos} cardPos
 * @param {TrelloId} [cardSourceId]
 * @return {Promise<TrelloCard>}
 */
export function createCard(listId, cardName, cardPos, cardSourceId = undefined) {
    const parameters = fetchHelper.obj2param({pos: cardPos, idCardSource: cardSourceId, idList: listId, name: cardName})
    return fetchHelper.trello.post("/cards", parameters, undefined, new TrelloCard())
}

/**
 * @param {TrelloId} cardId
 * @return {Promise<TrelloCard>}
 */
export function getCard(cardId) {
    return fetchHelper.trello.get(`/cards/${cardId}`, "", new TrelloCard())
}

/**
 * @param {TrelloId} cardId
 * @param {{desc: string}} changed
 * @return {Promise<TrelloCard>}
 */
export function updateCard(cardId, changed) {
    const parameters = fetchHelper.obj2param(changed)
    return fetchHelper.trello.put(`/cards/${cardId}`, parameters, undefined, new TrelloCard())
}

/**
 * @param {TrelloId} cardId
 */
export function deleteCard(cardId) {
    return fetchHelper.trello.delet(`/cards/${cardId}`, fetchHelper.defaultJSONable)
}

/**
 * @param {TrelloId} cardId
 * @param {string} text
 * @return {Promise<TrelloCommentCardAction>}
 */
export function createComment(cardId, text) {
    return fetchHelper.trello.post(`/cards/${cardId}/actions/comments`, fetchHelper.obj2param({text}), null, new TrelloCommentCardAction())
}

/**
 * @param {TrelloId} cardId
 * @param {string} name
 * @param {string} url
 * @return {Promise<TrelloAttachment>}
 */
export function createAttachment(cardId, name, url) {
    return fetchHelper.trello.post(`/cards/${cardId}/attachments`, fetchHelper.obj2param({name, url}), null, new TrelloAttachment())
}

/**
 * @param {TrelloId} cardId
 * @param {TrelloId} attachmentId
 * @return {Promise<TrelloAttachment>}
 */
export function deleteAttachment(cardId, attachmentId) {
    return fetchHelper.trello.delet(`/cards/${cardId}/attachments/${attachmentId}`, "", null, new TrelloAttachment())
}