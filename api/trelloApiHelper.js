import TrelloBoard from "../models/TrelloBoard.js";
import * as fetchHelper from "./fetchHelper.js";
import {arrayReviver} from "./fetchHelper.js";
import TrelloMember from "../models/TrelloMember.js";

/**
 * TODO
 *  There is a limit of 300 requests per 10 seconds for each API key and no more than 100 requests per 10-second interval for each token.
 *  If a request exceeds the limit, Trello will return a 429 error.
 */

export * from "./trelloWebhookApiHelper.js"
export * from "./trelloBoardApiHelper.js"
export * from "./trelloListApiHelper.js"
export * from "./trelloCardApiHelper.js"
export * from "./trelloChecklistApiHelper.js"

/**
 * @return {Promise<TrelloMember>}
 */
export function getTokenMember() {
    return fetchHelper.trello.get(`/tokens/${globalThis.config.trelloAuthToken}/member`, "", new TrelloMember())
}

/**
 * @param {string} name
 * @param {string} description
 * @param {TrelloId} idOrganization
 * @param {"org" | "private" | "public"} visibility
 * @return {Promise<TrelloBoard>}
 */
export function createBoard(name, description, idOrganization, visibility) {
    return fetchHelper.trello.post("/boards", `&name=${name}&desc=${description}&idOrganization=${idOrganization}&prefs_permissionLevel=${visibility}&prefs_selfJoin=false&defaultLists=false`, undefined, new TrelloBoard())
}

/**
 * @return {Promise<TrelloBoard[]>}
 */
export function getMemberBoards() {
    return fetchHelper.trello.get(`/members/me/boards`, "", new arrayReviver(TrelloBoard))
}

/**
 * @param {TrelloId} organizationId
 * @return {Promise<String>}
 */
export function getOrganizationName(organizationId) {
    return fetchHelper.trello.get(`/organizations/${organizationId}/name`, "", {fromJSON(value) {return value._value}})
}
