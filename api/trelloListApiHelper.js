import * as fetchHelper from "./fetchHelper.js";
import TrelloList from "../models/TrelloList.js";

/**
 * @param {TrelloId} boardId
 * @param {string} listName
 * @param {TrelloPos} [listPos]
 * @param {TrelloId} [listSourceId] id of the list to copy content from
 * @return Promise<TrelloList>
 */
export function createList(boardId, listName, listPos, listSourceId = undefined) {
    const posParameter = listPos ? `&pos=${listPos}` : ""
    const listSourceParameter = listSourceId ? `&idListSource=${listSourceId}` : ""
    return fetchHelper.post(`${globalThis.trello.url}/boards/${boardId}/lists?${globalThis.trello.urlParams}&name=${listName}${posParameter}${listSourceParameter}`, undefined, new TrelloList())
}

/**
 * @param {TrelloId} listId
 * @return {Promise<TrelloList>}
 */
export function getList(listId) {
    return fetchHelper.trello.get(`/lists/${listId}`, "", new TrelloList())
}

/**
 * @param {TrelloId} listId
 * @param {{name: string, closed: boolean, pos: TrelloPos}} changed
 * @return {Promise<TrelloList>}
 */
export function updateList(listId, changed) {
    const parameters = fetchHelper.obj2param(changed)
    return fetchHelper.trello.put(`/lists/${listId}`, parameters, undefined, new TrelloList())
}