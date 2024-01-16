import * as fetchHelper from "./fetchHelper.js";
import {arrayReviver} from "./fetchHelper.js";
import TrelloWebhook from "../models/TrelloWebhook.js";

/**
 * @param {TrelloId} trelloToken
 * @returns {Promise<TrelloWebhook[]>}
 */
export function getWebhooksForToken(trelloToken) {
    return fetchHelper.trello.get(`/tokens/${trelloToken}/webhooks`, "", new arrayReviver(TrelloWebhook))
}

/**
 * @param {TrelloId} idModel
 * @param {string} callbackURL
 * @param {string} [description]
 * @returns {Promise<TrelloWebhook>}
 */
export function postNewWebhook(idModel, callbackURL, description = "Automated%20translation%20webhook") {
    return fetchHelper.trello.post(
        `/tokens/${globalThis.trello.token}/webhooks`,
        `&description=${description}&callbackURL=${callbackURL}&idModel=${idModel}`,
        undefined,
        new TrelloWebhook()
    )
}

/**
 * @param {TrelloId} webhookId
 * @param {boolean} active
 * @return {Promise<TrelloWebhook>}
 */
export function updateWebhookActive(webhookId, active) {
    return fetchHelper.trello.put(`/webhooks/${webhookId}`, `&active=${active}`, undefined, new TrelloWebhook())
}

/**
 * @param {TrelloId} idWebhook
 * @returns {Promise<TrelloWebhook>}
 */
export function deleteWebHook(idWebhook) {
    return fetchHelper.trello.delet(`/tokens/${globalThis.trello.token}/webhooks/${idWebhook}`)
}