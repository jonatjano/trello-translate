import {asTrelloId} from "./trelloModels.js";
import TrelloLimits from "./TrelloLimits.js";

export default class TrelloCard {
    /** @type {TrelloId} */
    id
    /** @type {string} */
    address
    /** @type {TrelloBadges} */
    badges
    /** @type {string[]} */
    checkItemStates
    /** @type {boolean} */
    closed
    /** @type {string} */
    coordinates
    /** @type {string} */
    creationMethod
    /** @type {Date} */
    dateLastActivity
    /** @type {string} */
    desc
    /** @type {{emoji: object}} */
    descData
    /** @type {Date} */
    due
    /** @type {string} */
    dueReminder
    /** @type {string} */
    email
    /** @type {TrelloId} */
    idBoard
    /** @type {TrelloId[]} */
    idChecklists
    /** @type {TrelloId[]} */
    idLabels
    /** @type {TrelloId} */
    idList
    /** @type {TrelloId[]} */
    idMembers
    /** @type {TrelloId[]} */
    idMembersVoted
    /** @type {number} */
    idShort
    /** @type {TrelloId} */
    idAttachmentCover
    /** @type {TrelloId[]} */
    labels
    /** @type {TrelloLimits} */
    limits
    /** @type {string} */
    locationName
    /** @type {boolean} */
    manualCoverAttachment
    /** @type {string} */
    name
    /** @type {number} */
    pos
    /** @type {string} */
    shortLink
    /** @type {string} */
    shortUrl
    /** @type {boolean} */
    subscribed
    /** @type {URL} */
    url
    /** @type {TrelloCover} */
    cover

    fromJSON(value) {
        this.id = asTrelloId(value.id)
        this.address = value.address
        this.badges = new TrelloBadges().fromJSON(value.badges)
        this.checkItemStates = value.checkItemStates
        this.closed = value.closed
        this.coordinates = value.coordinates
        this.creationMethod = value.creationMethod
        this.dateLastActivity = new Date(value.dateLastActivity)
        this.desc = value.desc
        this.descData = value.descData
        this.due = value.due ? new Date(value.due) : undefined
        this.dueReminder = value.dueReminder
        this.email = value.email
        this.idBoard = asTrelloId(value.idBoard)
        this.idChecklists = value.idChecklists?.map(val => asTrelloId(typeof val === "object" ? val.id : val))
        this.idLabels = value.idLabels?.map(val => asTrelloId(typeof val === "object" ? val.id : val))
        this.idList = asTrelloId(value.idList)
        this.idMembers = value.idMembers?.map(val => asTrelloId(val))
        this.idMembersVoted = value.idMembersVoted?.map(val => asTrelloId(val))
        this.idShort = value.idShort
        this.idAttachmentCover = asTrelloId(value.idAttachmentCover)
        this.labels = value.labels?.map(val => asTrelloId(val))
        this.limits = value.limits ? new TrelloLimits().fromJSON(value.limits) : undefined
        this.locationName = value.locationName
        this.manualCoverAttachment = value.manualCoverAttachment
        this.name = value.name
        this.pos = value.pos
        this.shortLink = value.shortLink
        this.shortUrl = value.shortUrl
        this.subscribed = value.subscribed
        this.url = new URL(value.url)
        this.cover = new TrelloCover().fromJSON(value.cover)
        return this
    }
}

class TrelloBadges {
    /** @type {{trello: {board: number, card: number}}} */
    attachmentsByType
    /** @type {boolean} */
    location
    /** @type {number} */
    votes
    /** @type {boolean} */
    viewingMemberVoted
    /** @type {boolean} */
    subscribed
    /** @type {string} */
    fogbugz
    /** @type {number} */
    checkItems
    /** @type {number} */
    checkItemsChecked
    /** @type {number} */
    comments
    /** @type {number} */
    attachments
    /** @type {boolean} */
    description
    /** @type {?Date} */
    due
    /** @type {?Date} */
    start
    /** @type {boolean} */
    dueComplete

    fromJSON(value) {
        this.attachmentsByType = value.attachmentsByType
        this.location = value.location
        this.votes = value.votes
        this.viewingMemberVoted = value.viewingMemberVoted
        this.subscribed = value.subscribed
        this.fogbugz = value.fogbugz
        this.checkItems = value.checkItems
        this.checkItemsChecked = value.checkItemsChecked
        this.comments = value.comments
        this.attachments = value.attachments
        this.description = value.description
        this.due = value.due ? new Date(value.due) : undefined
        this.start = value.start ? new Date(value.start) : undefined
        this.dueComplete = value.dueComplete
        return this
    }
}

class TrelloCover {
    /** @type {TrelloId} */
    idAttachment
    /** @type {?TrelloColor} */
    color
    /** @type {boolean} */
    idUploadedBackground
    /** @type {string} */
    size
    /** @type {string} */
    brightness
    /** @type {boolean} */
    isTemplate
    /** @type {TrelloScaledCover[]} */
    scaled

    fromJSON(value) {
        this.idAttachment = asTrelloId(value.idAttachment)
        this.color = value.color
        this.idUploadedBackground = value.idUploadedBackground
        this.size = value.size
        this.brightness = value.brightness
        this.isTemplate = value.isTemplate
        this.scaled = value.scaled?.map(scaled => new TrelloScaledCover().fromJSON(scaled))
        return this
    }
}

class TrelloScaledCover {
    /** @type {TrelloId} */
    id
    /** @type {boolean} */
    scaled
    /** @type {string} */
    url
    /** @type {number} */
    bytes
    /** @type {number} */
    height
    /** @type {number} */
    width

    fromJSON(value) {
        this.id = asTrelloId(value.id)
        this.scaled = value.scaled
        this.url = value.url
        this.bytes = value.bytes
        this.height = value.height
        this.width = value.width
        return this
    }
}

export class TrelloAttachment {
    /** @type {TrelloId} */
    id
    /** @type {string} */
    bytes
    /** @type {Date} */
    date
    /** @type {TrelloColor} */
    edgeColor
    /** @type {TrelloId} */
    idMember
    /** @type {boolean} */
    isUpload
    /** @type {string} */
    mimeType
    /** @type {string} */
    name
    /** @type {array} */
    previews
    /** @type {string} */
    url
    /** @type {TrelloPos} */
    pos

    fromJSON(value) {
        this.id = value.id
        this.bytes = value.bytes
        this.date = new Date(value.date)
        this.edgeColor = value.edgeColor
        this.idMember = asTrelloId(value.idMember)
        this.isUpload = value.isUpload
        this.mimeType = value.mimeType
        this.name = value.name
        this.previews = value.previews
        this.url = value.url
        this.pos = value.pos
        return this
    }
}