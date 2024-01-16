import {asTrelloId} from "./trelloModels.js";
import TrelloLimits from "./TrelloLimits.js";

/**
 * @implements {JSONable}
 */
export default class TrelloBoard {
    /** @type {TrelloId} */
    id
    /** @type {string} */
    name
    /** @type {string} */
    desc
    /** @type {string} */
    descData
    /** @type {boolean} */
    closed
    /** @type {TrelloId} */
    idMemberCreator
    /** @type {TrelloId} */
    idOrganization
    /** @type {boolean} */
    pinned
    /** @type {URL} (URL) */
    url
    /** @type {URL} (URL) */
    shortUrl
    /** @type {TrelloPrefs} */
    prefs
    /** @type {{green: string, yellow: string, orange: string, red: string, purple: string, blue: string, sky: string, lime: string, pink: string, black: string}} */
    labelNames
    /** @type {TrelloLimits} */
    limits
    /** @type {boolean} */
    starred
    /** @type {string} */
    memberships
    /** @type {string} */
    shortLink
    /** @type {boolean} */
    subscribed
    /** @type {string} */
    powerUps
    /** @type {Date} (date) */
    dateLastActivity
    /** @type {Date} (date) */
    dateLastView
    /** @type {string} */
    idTags
    /** @type {?Date} */
    datePluginDisable
    /** @type {?string} */
    creationMethod
    /** @type {number} integer */
    ixUpdate
    /** @type {?string} */
    templateGallery
    /** @type {boolean} */
    enterpriseOwned

    /**
     * @param {Object} value
     * @return {this}
     */
    fromJSON(value) {
        this.id = asTrelloId(value.id)
        this.name = value.name
        this.desc = value.desc
        this.descData = value.descData
        this.closed = value.closed
        this.idMemberCreator = asTrelloId(value.idMemberCreator)
        this.idOrganization = asTrelloId(value.idOrganization)
        this.pinned = value.pinned
        this.url = new URL(value.url)
        this.shortUrl = new URL(value.shortUrl)
        this.prefs = new TrelloPrefs().fromJSON(value.prefs)
        this.labelNames = value.labelNames
        this.limits = value.limits ? new TrelloLimits().fromJSON(value.limits) : null
        this.starred = value.starred
        this.memberships = value.memberships
        this.shortLink = value.shortLink
        this.subscribed = value.subscribed
        this.powerUps = value.powerUps
        this.dateLastActivity = new Date(value.dateLastActivity)
        this.dateLastView = new Date(value.dateLastView)
        this.idTags = value.idTags
        this.datePluginDisable = value.datePluginDisable ? new Date(value.datePluginDisable) : null
        this.creationMethod = value.creationMethod
        this.ixUpdate = value.ixUpdate
        this.templateGallery = value.templateGallery
        this.enterpriseOwned = value.enterpriseOwned
        return this
    }

    /**
     * @return {Object}
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            desc: this.desc,
            descData: this.descData,
            closed: this.closed,
            idMemberCreator: this.idMemberCreator,
            idOrganization: this.idOrganization,
            pinned: this.pinned,
            url: this.url.href,
            shortUrl: this.shortUrl.href,
            prefs: this.prefs.toJSON(),
            labelNames: this.labelNames,
            limits: this.limits.toJSON(),
            starred: this.starred,
            memberships: this.memberships,
            shortLink: this.shortLink,
            subscribed: this.subscribed,
            powerUps: this.powerUps,
            dateLastActivity: this.dateLastActivity.toISOString(),
            dateLastView: this.dateLastView.toISOString(),
            idTags: this.idTags,
            datePluginDisable: this.datePluginDisable?.toISOString(),
            creationMethod: this.creationMethod,
            ixUpdate: this.ixUpdate,
            templateGallery: this.templateGallery,
            enterpriseOwned: this.enterpriseOwned
        }
    }
}

/**
 * @implements {JSONable}
 */
export class TrelloPrefs {
    /** @type {"org" | "board"} */
    permissionLevel
    /** @type {boolean} */
    hideVotes
    /** @type {"disabled" | "enabled"} */
    voting
    /** @type {string} */
    comments
    /** @type {any} */
    invitations
    /** @type {boolean} */
    selfJoin
    /** @type {boolean} */
    cardCovers
    /** @type {boolean} */
    isTemplate
    /** @type {TrelloCardAging} */
    cardAging
    /** @type {boolean} */
    calendarFeedEnabled
    /** @type {TrelloId} */
    background
    /** @type {string} */
    backgroundImage
    /** @type {TrelloImageDescriptor[]} */
    backgroundImageScaled
    /** @type {boolean} */
    backgroundTile
    /** @type {string} */
    backgroundBrightness
    /** @type {string} */
    backgroundBottomColor
    /** @type {string} */
    backgroundTopColor
    /** @type {boolean} */
    canBePublic
    /** @type {boolean} */
    canBeEnterprise
    /** @type {boolean} */
    canBeOrg
    /** @type {boolean} */
    canBePrivate
    /** @type {boolean} */
    canInvite

    /**
     * @param {Object} value
     * @return {this}
     */
    fromJSON(value) {
        this.permissionLevel = value.permissionLevel
        this.hideVotes = value.hideVotes
        this.voting = value.voting
        this.comments = value.comments
        this.invitations = value.invitations
        this.selfJoin = value.selfJoin
        this.cardCovers = value.cardCovers
        this.isTemplate = value.isTemplate
        this.cardAging = value.cardAging
        this.calendarFeedEnabled = value.calendarFeedEnabled
        this.background = value.background
        this.backgroundImage = value.backgroundImage
        this.backgroundImageScaled = value.backgroundImageScaled?.map(backImgScaled => new TrelloImageDescriptor().fromJSON(backImgScaled))
        this.backgroundTile = value.backgroundTile
        this.backgroundBrightness = value.backgroundBrightness
        this.backgroundBottomColor = value.backgroundBottomColor
        this.backgroundTopColor = value.backgroundTopColor
        this.canBePublic = value.canBePublic
        this.canBeEnterprise = value.canBeEnterprise
        this.canBeOrg = value.canBeOrg
        this.canBePrivate = value.canBePrivate
        this.canInvite = value.canInvite
        return this
    }

    /**
     * @return {Object}
     */
    toJSON() {
        return {
            permissionLevel: this.permissionLevel,
            hideVotes: this.hideVotes,
            voting: this.voting,
            comments: this.comments,
            invitations: this.invitations,
            selfJoin: this.selfJoin,
            cardCovers: this.cardCovers,
            isTemplate: this.isTemplate,
            cardAging: this.cardAging,
            calendarFeedEnabled: this.calendarFeedEnabled,
            background: this.background,
            backgroundImage: this.backgroundImage,
            backgroundImageScaled: this.backgroundImageScaled?.map(backImgScaled => backImgScaled.toJSON()),
            backgroundTile: this.backgroundTile,
            backgroundBrightness: this.backgroundBrightness,
            backgroundBottomColor: this.backgroundBottomColor,
            backgroundTopColor: this.backgroundTopColor,
            canBePublic: this.canBePublic,
            canBeEnterprise: this.canBeEnterprise,
            canBeOrg: this.canBeOrg,
            canBePrivate: this.canBePrivate,
            canInvite: this.canInvite
        }
    }
}

class TrelloImageDescriptor {
    /** @type {number} (integer) */
    width
    /** @type {number} (integer) */
    height
    /** @type {URL} (URL) */
    url

    /**
     * @param {Object} value
     * @return {this}
     */
    fromJSON(value) {
        this.width = value.width
        this.height = value.height
        this.url = new URL(value.url)
        return this
    }

    /**
     * @return {Object}
     */
    toJSON() {
        return {
            width: this.width,
            height: this.height,
            url: this.url.href
        }
    }
}
