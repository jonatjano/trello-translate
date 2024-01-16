import * as fetchHelper from "./fetchHelper.js";
import TrelloChecklist, {TrelloChecklistItem} from "../models/TrelloChecklist.js";

/**
 * @param {TrelloId} checklistId
 * @return {Promise<TrelloChecklist>}
 */
export function getChecklist(checklistId) {
    return fetchHelper.trello.get(`/checklist/${checklistId}`, "&checkItem_fields=all", new TrelloChecklist())
}

/**
 * @param {TrelloId} cardId
 * @param {string} name
 * @param {TrelloPos} pos
 * @return {Promise<TrelloChecklist>}
 */
export function createChecklist(cardId, name, pos) {
    return fetchHelper.trello.post("/checklists", `&idCard=${cardId}&name=${name}&pos=${pos}`, null, new TrelloChecklist())
}

/**
 * @param {TrelloId} checklistId
 * @param {{name: ?string, pos: ?TrelloPos}} paramObject
 * @return {Promise<TrelloChecklist>}
 */
export function updateChecklist(checklistId, paramObject) {
    const parameters = fetchHelper.obj2param(paramObject)
    return fetchHelper.trello.put(`/checklists/${checklistId}`, parameters, null, new TrelloChecklist())
}

/**
 * @param {TrelloId} checklistId
 * @param {{name: string, pos: TrelloPos?, checked: boolean?, due: Date?, dueReminder: number?, idMember: TrelloId?}} paramObject
 * @return {Promise<TrelloChecklistItem>}
 */
export function createChecklistItem(checklistId, paramObject) {
    const parameters = fetchHelper.obj2param(paramObject)
    return fetchHelper.trello.post(`/checklists/${checklistId}/checkItems`, parameters, null, new TrelloChecklistItem())
}

/**
 * @param {TrelloId} cardId
 * @param {TrelloId} checkItemId
 * @param {{name: string?, pos: TrelloPos?, state: ("complete" | "incomplete")?, due: Date?, dueReminder: number?, idMember: TrelloId?}} paramObject
 * @return {Promise<TrelloChecklistItem>}
 */
export function updateChecklistItem(cardId, checkItemId, paramObject) {
    const parameters = fetchHelper.obj2param(paramObject)
    return fetchHelper.trello.put(`/cards/${cardId}/checkItem/${checkItemId}`, parameters, null, new TrelloChecklistItem())
}

/**
 * @param {TrelloId} checklistId
 * @return {Promise<TrelloChecklist>}
 */
export function deleteChecklist(checklistId) {
    return fetchHelper.trello.delet(`/checklists/${checklistId}`, new TrelloChecklist())
}