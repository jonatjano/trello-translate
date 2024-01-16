import * as fs from "node:fs/promises"

/**
 * @typedef {{id: TrelloId, lastAction: TrelloId, language: languageMarker}} CacheTargetBoard
 */

/**
 * @typedef {{
 *  [sourceId: TrelloId]: {
 *      [targetBoardId: TrelloId]: TrelloId
 *  }
 * }} CacheObject
 */

/**
 * @typedef {{
 *  [sourceBoardId: TrelloId]: {
 *      targets: CacheTargetBoard[],
 *      lists: CacheObject,
 *      cards: CacheObject,
 *      checklists: CacheObject,
 *      checklistItems: CacheObject,
 *      comments: CacheObject,
 *      labels: CacheObject,
 *      attachments: CacheObject
 *  }
 * }} Cache
 */

/** @type {Cache} */
let cache


export async function loadCache() {
    const cachePath = globalThis.config.cachePath

    if (globalThis.config.verbose) {
        console.log("Loading cache")
    }

    try {
        cache = JSON.parse(await fs.readFile(cachePath, {encoding: "utf-8"}))
    } catch (e) {
        console.warn("No cache found")
    }
    initForConfig()
}

export function initForConfig() {
    if (! cache) { cache = {} }
    if (! cache[globalThis.config.sourceBoard.id]) {
        cache[globalThis.config.sourceBoard.id] = {
            targets: [],
            lists: {},
            cards: {},
            checklists: {},
            checklistItems: {},
            comments: {},
            labels: {},
            attachments: {}
        }
    }
}

export async function saveCache() {
    const cachePath = globalThis.config.cachePath

    if (globalThis.config.verbose) {
        console.log("Saving cache")
        // console.log(JSON.stringify(cache, null, 4))
    }

    const content = globalThis.config.verbose ? JSON.stringify(cache, null, 4) : JSON.stringify(cache)
    await fs.writeFile(cachePath, content)
}

export function logCache() {
    console.log(cache)
}

/**
 * Get Target boards for source board
 * @param {TrelloId} sourceBoardId
 * @return {CacheTargetBoard[]}
 */
export function getTargetBoards(sourceBoardId) {
    return cache?.[sourceBoardId]?.targets
}

/**
 * Get Target board for source board and language
 * @param {TrelloId} sourceBoardId
 * @param {TrelloId} targetBoardId
 * @return {CacheTargetBoard}
 */
export function getTargetBoardById(sourceBoardId, targetBoardId) {
    return cache?.[sourceBoardId]?.targets.find(target => target.id === targetBoardId)
}
/**
 * Get Target board for source board and language
 * @param {TrelloId} sourceBoardId
 * @param {languageMarker} language
 * @return {CacheTargetBoard}
 */
export function getTargetBoardByLanguage(sourceBoardId, language) {
    return cache?.[sourceBoardId]?.targets.find(target => target.language === language)
}

export function setTargetLastAction(sourceBoardId, targetBoardId, actionId) {
    getTargetBoardById(sourceBoardId, targetBoardId).lastAction = actionId
}

/**
 * add target board for source board
 * @param {TrelloId} sourceBoardId
 * @param {TrelloId} targetBoardId
 * @param {languageMarker} language
 * @param {TrelloId} lastAction
 * @return {CacheTargetBoard}
 */
export function addTargetBoard(sourceBoardId, targetBoardId, language, lastAction) {
    const targetBoard = {id: targetBoardId, language, lastAction}
    cache[sourceBoardId].targets.push(targetBoard)
    return targetBoard
}

/**
 * remove target board for source board and language
 * @param {TrelloId} sourceBoardId
 * @param {languageMarker} language
 * @return {boolean} true if a board was removed
 */
export function deleteTargetBoard(sourceBoardId, language) {
    const prevSize = cache[sourceBoardId].targets.length
    const idToDelete = cache[sourceBoardId].targets.find(target => target.language === language).id
    cache[sourceBoardId].targets = cache[sourceBoardId].targets.filter(target => target.id !== idToDelete)

    Object.keys(cache[sourceBoardId]).forEach(key =>
        Object.values(cache[sourceBoardId][key]).forEach(cache => delete cache[idToDelete])
    )

    return prevSize < cache[sourceBoardId].targets.length
}

/**
 * Get id of the list on the target board
 * @param {TrelloId} sourceBoardId
 * @param {TrelloId} sourceListId
 * @param {TrelloId} targetBoardId
 * @param {TrelloId} targetListId
 */
export function setList(sourceBoardId, sourceListId, targetBoardId, targetListId) {
    if (! cache[sourceBoardId].lists[sourceListId]) { cache[sourceBoardId].lists[sourceListId] = {} }
    cache[sourceBoardId].lists[sourceListId][targetBoardId] = targetListId
}

/**
 * Get id of the list on the target board
 * @param {TrelloId} sourceBoardId
 * @param {TrelloId} sourceListId
 * @param {TrelloId} targetBoardId
 * @return {TrelloId}
 */
export function getList(sourceBoardId, sourceListId, targetBoardId) {
    return cache?.[sourceBoardId]?.lists?.[sourceListId]?.[targetBoardId]
}

/**
 * @param {TrelloId} sourceBoardId
 * @param {TrelloId} sourceCardId
 * @param {TrelloId} targetBoardId
 * @param {TrelloId} targetCardId
 */
export function setCard(sourceBoardId, sourceCardId, targetBoardId, targetCardId) {
    if (sourceCardId === "58b645d6c02901d29add304d") { console.log(`



card ${sourceCardId} added to cache as ${targetCardId}



`) }
    if (! cache[sourceBoardId].cards[sourceCardId]) { cache[sourceBoardId].cards[sourceCardId] = {} }
    cache[sourceBoardId].cards[sourceCardId][targetBoardId] = targetCardId
}

/**
 * @param {TrelloId} sourceBoardId
 * @param {TrelloId} sourceCardId
 * @param {TrelloId} targetBoardId
 * @return {TrelloId}
 */
export function getCard(sourceBoardId, sourceCardId, targetBoardId) {
    return cache?.[sourceBoardId]?.cards?.[sourceCardId]?.[targetBoardId]
}

export function deleteCard(sourceBoardId, sourceCardId, targetBoardId) {
    const ret = cache?.[sourceBoardId]?.cards?.[sourceCardId]?.[targetBoardId]
    // delete cache?.[sourceBoardId]?.cards?.[sourceCardId]?.[targetBoardId]
    return ret
}

/**
 * @param {TrelloId} sourceBoardId
 * @param {TrelloId} sourceChecklistId
 * @param {TrelloId} targetBoardId
 * @param {TrelloId} targetChecklistId
 */
export function setChecklist(sourceBoardId, sourceChecklistId, targetBoardId, targetChecklistId) {
    if (! cache[sourceBoardId].checklists[sourceChecklistId]) { cache[sourceBoardId].checklists[sourceChecklistId] = {} }
    cache[sourceBoardId].checklists[sourceChecklistId][targetBoardId] = targetChecklistId
}

/**
 * @param {TrelloId} sourceBoardId
 * @param {TrelloId} sourceChecklistId
 * @param {TrelloId} targetBoardId
 * @return {string}
 */
export function getChecklist(sourceBoardId, sourceChecklistId, targetBoardId) {
    return cache?.[sourceBoardId]?.checklists?.[sourceChecklistId]?.[targetBoardId]
}

/**
 * @param {TrelloId} sourceBoardId
 * @param {TrelloId} sourceChecklistItemId
 * @param {TrelloId} targetBoardId
 * @param {TrelloId} targetChecklistItemId
 */
export function setChecklistItem(sourceBoardId, sourceChecklistItemId, targetBoardId, targetChecklistItemId) {
    if (! cache[sourceBoardId].checklistItems[sourceChecklistItemId]) { cache[sourceBoardId].checklistItems[sourceChecklistItemId] = {} }
    cache[sourceBoardId].checklistItems[sourceChecklistItemId][targetBoardId] = targetChecklistItemId
}

/**
 * @param {TrelloId} sourceBoardId
 * @param {TrelloId} sourceChecklistItemId
 * @param {TrelloId} targetBoardId
 * @return {string}
 */
export function getChecklistItem(sourceBoardId, sourceChecklistItemId, targetBoardId) {
    return cache?.[sourceBoardId]?.checklistItems?.[sourceChecklistItemId]?.[targetBoardId]
}

/**
 * @param {TrelloId} sourceBoardId
 * @param {TrelloId} sourceCommentId
 * @param {TrelloId} targetBoardId
 * @param {TrelloId} targetCommentId
 */
export function setComment(sourceBoardId, sourceCommentId, targetBoardId, targetCommentId) {
    if (! cache[sourceBoardId].comments[sourceCommentId]) { cache[sourceBoardId].comments[sourceCommentId] = {} }
    cache[sourceBoardId].comments[sourceCommentId][targetBoardId] = targetCommentId
}

/**
 * @param {TrelloId} sourceBoardId
 * @param {TrelloId} sourceCommentId
 * @param {TrelloId} targetBoardId
 * @return {string}
 */
export function getComment(sourceBoardId, sourceCommentId, targetBoardId) {
    return cache?.[sourceBoardId]?.comments?.[sourceCommentId]?.[targetBoardId]
}

/**
 * @param {TrelloId} sourceBoardId
 * @param {TrelloId} sourceLabelId
 * @param {TrelloId} targetBoardId
 * @param {TrelloId} targetLabelId
 */
export function setLabel(sourceBoardId, sourceLabelId, targetBoardId, targetLabelId) {
    if (! cache[sourceBoardId].labels[sourceLabelId]) { cache[sourceBoardId].labels[sourceLabelId] = {} }
    cache[sourceBoardId].labels[sourceLabelId][targetBoardId] = targetLabelId
}

/**
 * @param {TrelloId} sourceBoardId
 * @param {TrelloId} sourceLabelId
 * @param {TrelloId} targetBoardId
 * @return {string}
 */
export function getLabel(sourceBoardId, sourceLabelId, targetBoardId) {
    return cache?.[sourceBoardId]?.labels?.[sourceLabelId]?.[targetBoardId]
}

/**
 * @param {TrelloId} sourceBoardId
 * @param {TrelloId} sourceAttachmentId
 * @param {TrelloId} targetBoardId
 * @param {TrelloId} targetAttachmentId
 */
export function setAttachment(sourceBoardId, sourceAttachmentId, targetBoardId, targetAttachmentId) {
    if (! cache[sourceBoardId].attachments[sourceAttachmentId]) { cache[sourceBoardId].attachments[sourceAttachmentId] = {} }
    cache[sourceBoardId].attachments[sourceAttachmentId][targetBoardId] = targetAttachmentId
}

/**
 * @param {TrelloId} sourceBoardId
 * @param {TrelloId} sourceAttachmentId
 * @param {TrelloId} targetBoardId
 * @return {string}
 */
export function getAttachment(sourceBoardId, sourceAttachmentId, targetBoardId) {
    return cache?.[sourceBoardId]?.attachments?.[sourceAttachmentId]?.[targetBoardId]
}

export function deleteAttachment(sourceBoardId, sourceAttachmentId, targetBoardId) {
    const ret = cache?.[sourceBoardId]?.attachments?.[sourceAttachmentId]?.[targetBoardId]
    delete cache?.[sourceBoardId]?.attachments?.[sourceAttachmentId]?.[targetBoardId]
    return ret
}