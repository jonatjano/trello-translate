import {asTrelloId} from "../trelloModels.js";

export default class TrelloActionMemberCreator {
    /** @type {TrelloId} */
    id
    /** @type {boolean} */
    activityBlocked
    /** @type {TrelloId} */
    avatarHash
    /** @type {URL} */
    avatarUrl
    /** @type {string} */
    fullName
    /** @type {?TrelloId} */
    idMemberReferrer
    /** @type {string} */
    initials
    /** @type {Object} */
    nonPublic
    /** @type {boolean} */
    nonPublicAvailable
    /** @type {string} */
    username

    fromJSON(value) {
        this.id = asTrelloId(value.id)
        this.activityBlocked = value.activityBlocked
        this.avatarHash = value.avatarHash
        this.avatarUrl = new URL(value.avatarUrl)
        this.fullName = value.fullName
        this.idMemberReferrer = asTrelloId(value.idMemberReferrer)
        this.initials = value.initials
        this.nonPublic = value.nonPublic
        this.nonPublicAvailable = value.nonPublicAvailable
        this.username = value.username
        return this;
    }
}