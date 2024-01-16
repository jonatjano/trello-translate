import * as fetchHelper from "./fetchHelper.js";
import TrelloList from "../models/TrelloList.js";
import {arrayReviver, defaultJSONable} from "./fetchHelper.js";
import {getListFilter, TrelloLabel} from "../models/trelloModels.js";
import TrelloAction from "../models/trelloActions/TrelloAction.js";
import TrelloBoard from "../models/TrelloBoard.js";
import TrelloCard from "../models/TrelloCard.js";

/**
 * @param {TrelloId} boardId
 * @return {Promise<TrelloBoard>}
 */
export function getBoard(boardId) {
    return fetchHelper.trello.get(`/boards/${boardId}`, "", new TrelloBoard())
}

/**
 * @param {TrelloId} boardId
 * @param {TrelloId} memberId
 * @param {boolean} [isAdmin = false]
 * @return {Promise<void>}
 */
export function addMember(boardId, memberId, isAdmin = false) {
    return fetchHelper.trello.put(`/boards/${boardId}/members/${memberId}`, `&type=${isAdmin ? "admin" : "normal"}`, defaultJSONable)
}

/**
 * @param {TrelloId} boardId
 * @param {getListFilter} [filter]
 * @return {Promise<TrelloList[]>}
 */
export function getListsOnBoard(boardId, filter = getListFilter.open) {
    return fetchHelper.trello.get(`/boards/${boardId}/lists`, `&filter=${filter}`, new arrayReviver(TrelloList))
}

/**
 * @param {TrelloId} boardId
 * @param {TrelloId} [since]
 * @param {string} [fields]
 * @param {number} [limit = 1000]
 * @return Promise<TrelloAction[]>
 */
export function getLastsActionsOfABoard(boardId, {since, fields = "id,data,type", limit = 1000} = {}) {
    const sinceParameter = since ? `&since=${since}` : ""
    const fieldParameter = fields ? `&fields=${fields}` : ""
    return fetchHelper.trello.get(`/boards/${boardId}/actions`, `${sinceParameter}${fieldParameter}&limit=${limit}&member=false&memberCreator=false`, new arrayReviver(TrelloAction))
}


/**
 * @param {TrelloId} boardId
 * @return Promise<TrelloAction>
 */
export function getCreateBoardAction(boardId) {
    return fetchHelper.trello.get(`/boards/${boardId}/actions`, `&filter=createBoard&fields=id,data,type&limit=100&member=false&memberCreator=false`, new arrayReviver(TrelloAction))[0]
}


/**
 * @param {TrelloId} boardId
 * @param {TrelloId} [since]
 * @param {string} [fields]
 * @return Promise<TrelloAction[]>
 */
export async function getAllActionsOfABoard(boardId, {since, fields = "id,data,type"} = {}) {
    const fieldParameter = fields ? `&fields=${fields}` : ""
    /** @type {TrelloAction[]} */
    let ret = []
    /** @type {TrelloAction[]} */
    let actions = await fetchHelper.trello.get(`/boards/${boardId}/actions`, `${fieldParameter}&limit=1000&member=false&memberCreator=false`, new arrayReviver(TrelloAction))
    while (actions.length !== 0) {
        ret.push(...actions)
        const beforeParameter = `&before=${actions[actions.length - 1].id}`
        actions = await fetchHelper.trello.get(`/boards/${boardId}/actions`, `${fieldParameter}${beforeParameter}&limit=1000&member=false&memberCreator=false`, new arrayReviver(TrelloAction))
    }

    ret.push(...actions)

    if (since) {
        let found = false
        ret = ret.filter(act => { found = found || act.id === since; return ! found })
    }

    return ret.reverse()
}

/**
 * @param {TrelloId} boardId
 * @param {{name: ?string, desc: ?string, closed: ?boolean}} changed
 * @return {Promise<TrelloBoard>}
 */
export function updateBoard(boardId, changed) {
    const parameters = fetchHelper.obj2param(changed)
    return fetchHelper.trello.put(`/boards/${boardId}`, parameters, undefined, new TrelloBoard())
}

/**
 * @param {TrelloId} boardId
 * @return {Promise<TrelloLabel[]>}
 */
export function getLabels(boardId) {
    return fetchHelper.trello.get(`/boards/${boardId}/labels`, "", new arrayReviver(TrelloLabel))
}

/**
 * @param {string} name
 * @param {TrelloColor} color
 * @param {TrelloId} idBoard
 * @return {Promise<TrelloLabel>}
 */
export function createLabel(name, color, idBoard) {
    const parameters = fetchHelper.obj2param({name, color, idBoard})
    return fetchHelper.trello.post("/labels", parameters, null, new TrelloLabel())
}

/**
 * @param {TrelloId} labelId
 * @return {Promise<TrelloLabel>}
 */
export function getLabel(labelId) {
    return fetchHelper.trello.get(`/labels/${labelId}`, "", new TrelloLabel())
}

/**
 * @param {TrelloId} labelId
 * @param {{name: string, color: TrelloColor}} changed
 * @return {Promise<TrelloLabel>}
 */
export function updateLabel(labelId, changed) {
    const parameters = fetchHelper.obj2param(changed)
    return fetchHelper.trello.put(`/labels/${labelId}`, parameters, null, new TrelloLabel())
}

/**
 * @param {TrelloId} labelId
 * @return {Promise<TrelloLabel>}
 */
export function deleteLabel(labelId) {
    return fetchHelper.trello.delet(`/labels/${labelId}`, new TrelloLabel())
}