import express from "express"
const app = express()
app.use(express.json())

import "./config.js"
import {validateConfig} from "./utils/validationUtils.js"

import * as cacheUtils from "./utils/cacheUtils.js"
await cacheUtils.loadCache()

import * as trelloApiHelper from "./api/trelloApiHelper.js"
import * as deepLApiHelper from "./api/deepLApiHelper.js"
import TrelloCreateListAction from "./models/trelloActions/TrelloCreateListAction.js"
import TrelloUpdateListAction from "./models/trelloActions/TrelloUpdateListAction.js";
import TrelloCreateCardAction from "./models/trelloActions/TrelloCreateCardAction.js";
import TrelloUpdateCardAction from "./models/trelloActions/TrelloUpdateCardAction.js";
import TrelloAddChecklistToCardAction from "./models/trelloActions/TrelloAddChecklistToCardAction.js";
import TrelloUpdateCheckItemStateOnCardAction from "./models/trelloActions/TrelloUpdateCheckItemStateOnCardAction.js";
import TrelloCommentCardAction from "./models/trelloActions/TrelloCommentCardAction.js";
import TrelloUpdateBoardAction from "./models/trelloActions/TrelloUpdateBoardAction.js";
import TrelloDeleteCardAction from "./models/trelloActions/TrelloDeleteCardAction.js";
import TrelloAddAttachmentToCardAction from "./models/trelloActions/TrelloAddAttachmentToCardAction.js";
import TrelloUpdateChecklistAction from "./models/trelloActions/TrelloUpdateChecklistAction.js";
import TrelloDeleteAttachmentFromCardAction from "./models/trelloActions/TrelloDeleteAttachmentFromCardAction.js";
import TrelloConvertToCardFromCheckItemAction from "./models/trelloActions/TrelloConvertToCardFromCheckItemAction.js";
import TrelloRemoveChecklistFromCardAction from "./models/trelloActions/TrelloRemoveChecklistFromCardAction.js";

await validateConfig()
    .then(() => {
        console.log("Config is valid")
    })
    .catch(error => {
        console.error(`following error was detected in config : ${error}`)
    })

/*
 * catch back on board changes since last start
 */
const configTargets = globalThis.config.targetBoards

// create board and add them to the cache
const createBoardAction = (await trelloApiHelper.getAllActionsOfABoard(globalThis.config.sourceBoard.id))[0]
const sourceBoard = await trelloApiHelper.getBoard(globalThis.config.sourceBoard.id)
const sourceLabels = await trelloApiHelper.getLabels(sourceBoard.id)
const languages = await deepLApiHelper.getTargetLanguages()
for (const target of configTargets) {
    let cached = cacheUtils.getTargetBoardByLanguage(sourceBoard.id, target.language)
    if (cached) {
        // check that cached board still exists
        const board = await trelloApiHelper.getBoard(cached.id)
        if (! board) {
            console.warn(`Couldn't get cached board for source board ${sourceBoard.name} and language ${target.language}, creating a new board`)
            cacheUtils.deleteTargetBoard(sourceBoard.id, target.language)
            cached = undefined
        }
    }
    if (! cached) {
        // create a new board
        const language = languages.find(lang => lang.language === target.language)
        const newBoard = await trelloApiHelper.createBoard(
            target.name ?? `${sourceBoard.name} ${language.name}`,
            target.description ?? await deepLApiHelper.translate(sourceBoard.desc, globalThis.config.sourceBoard.language, language.language),
            target.workspace ?? sourceBoard.idOrganization,
            target.visibility ?? "public"
        )
        console.log(`Created board ${newBoard.name} accessible at ${newBoard.shortUrl}`)
        await new Promise(res => setTimeout(res, 5000))
        // TODO test member addition using Megu once stuff works
        // add members according to the config
        if (target.members) {
            await Promise.all(target.members.map(member => addMember(newBoard.id, member.id, member.isAdmin)))
        }
        cacheUtils.addTargetBoard(sourceBoard.id, newBoard.id, language.language, createBoardAction.id)

        // edit labels to be equals to sourceboard's
        const labelsToDelete = await trelloApiHelper.getLabels(newBoard.id)
        await Promise.all(labelsToDelete.map(label => trelloApiHelper.deleteLabel(label.id)))
        await Promise.all(sourceLabels.map(label =>
            deepLApiHelper.translate(label.name, globalThis.config.sourceBoard.language, target.language)
                .then(translatedName =>
                    trelloApiHelper.createLabel(translatedName, label.color, newBoard.id)
                )
                .then(newLabel => cacheUtils.setLabel(sourceBoard.id, label.id, newBoard.id, newLabel.id))
        ))
    }
    const targetBoard = cacheUtils.getTargetBoardByLanguage(sourceBoard.id, target.language)
    const actions = await trelloApiHelper.getAllActionsOfABoard(sourceBoard.id)

    let doAction = false

    let i = 0
    for (const act of actions) {
        ++i;
        if (doAction) {
            if (globalThis.config.verbose) {
                console.log(`Action n°${i}/${actions.length} ${act.type}`)
            }
            await dispatchAction(act, [targetBoard])
        }
        if (act.id === targetBoard.lastAction) { doAction = true }
    }
}

await cacheUtils.saveCache()
process.exit(0)
// const actions = await trelloApiHelper.getActionsOfABoard(globalThis.config.sourceBoard.id)
// console.log(actions.map(act => ({id: act.id, type: act.type})))
// console.log(actions.length)

/*
 * Setting the webserver
 */
app.head("/trelloWebhook", function(req, res) {
    return res.status(200).end()
})
app.get("/trelloWebhook", function(req, res) {
    res.write("Hello, World!");
    return res.status(200).end()
})
app.post("/trelloWebhook", function(req, res) {
    dispatchAction(req.body.action, cacheUtils.getTargetBoards(globalThis.config.sourceBoard.id))
    return res.status(200).end()
})
app.listen(globalThis.config.port, () => {
    console.log(`server running on port ${globalThis.config.port}`)
})

/*
 * setting the SIGINT event to save the cache
 */
process.on('SIGINT', async function() {
    await cleanExit()
})

async function cleanExit() {
    if (globalThis.webhookId) {
        console.log("Desactiving webhook")
        await trelloApiHelper.updateWebhookActive(globalThis.webhookId, false)
    }
    await cacheUtils.saveCache()
    process.exit();
}

/*
 * Telling to Trello we're ready to receive webhook events
 */
await trelloApiHelper.getWebhooksForToken(globalThis.trello.token)
    .then(res => {
        const callbackUrl = `${globalThis.config.serverURL}/trelloWebhook`
        const found = res.find(webhook => webhook.callbackURL.href === callbackUrl)
        if (found) {
            globalThis.webhookId = found.id
            console.log("A webhook already exists for this callback url")
            trelloApiHelper.updateWebhookActive(globalThis.webhookId, true)
        } else {
            trelloApiHelper.postNewWebhook(globalThis.config.sourceBoard.id, callbackUrl)
                .then(webhook => {
                    globalThis.webhookId = webhook.id
                    console.log(webhook)
                    console.log(`Successfully create webhook for board ${webhook.idModel}`)
                })
        }
    })
    .catch(async err => {
        console.error(`Failed to get existing trello webhooks for token : ${await err.text()}`)
        process.exit(5)
    })

/*
 * event processing function
 */

/**
 * @param {TrelloAction} action
 * @param {CacheTargetBoard[]} targets
 */
function dispatchAction(action, targets = cacheUtils.getTargetBoards(globalThis.config.sourceBoard.id)) {
    switch (action.type) {
        case "createList": return processCreateListAction(new TrelloCreateListAction().fromJSON(action), targets)
        case "addToOrganizationBoard": break // NOOP
        case "updateList": return processUpdateListAction(new TrelloUpdateListAction().fromJSON(action), targets)
        case "createCard": return processCreateCardAction(new TrelloCreateCardAction().fromJSON(action), targets)
        case "updateCard": return processUpdateCardAction(new TrelloUpdateCardAction().fromJSON(action), targets)
        case "addChecklistToCard": return processAddChecklistToCardAction(new TrelloAddChecklistToCardAction().fromJSON(action), targets)
        case "updateCheckItemStateOnCard": return processUpdateCheckItemStateOnCardAction(new TrelloUpdateCheckItemStateOnCardAction().fromJSON(action), targets)
        case "commentCard": return processCommentCardAction(new TrelloCommentCardAction().fromJSON(action), targets)
        case "updateBoard": return processUpdateBoardAction(new TrelloUpdateBoardAction().fromJSON(action), targets)
        case "deleteCard": return processDeleteCardAction(new TrelloDeleteCardAction().fromJSON(action), targets)
        case "addAttachmentToCard": return processAddAttachmentToCardAction(new TrelloAddAttachmentToCardAction().fromJSON(action), targets)
        case "addMemberToBoard": break // NOOP
        case "addMemberToCard": break // NOOP
        case "removeMemberFromCard": break // NOOP
        case "updateChecklist": return processUpdateChecklistAction(new TrelloUpdateChecklistAction().fromJSON(action), targets)
        case "deleteAttachmentFromCard": return processDeleteAttachmentFromCardAction(new TrelloDeleteAttachmentFromCardAction().fromJSON(action), targets)
        case "convertToCardFromCheckItem": return processConvertToCardFromCheckItemAction(new TrelloConvertToCardFromCheckItemAction().fromJSON(action), targets)
        case "removeChecklistFromCard": return processRemoveChecklistFromCardAction(new TrelloRemoveChecklistFromCardAction().fromJSON(action), targets)
        case "enablePlugin": break // NOOP
        default: {
            console.error(`
################################################
#
# unprocessed action type "${action.type}"
#  please report to bot dev including the following object
#  you can skip/manage it by adding a case in index.js:dispatchAction()
#
################################################
`)
            console.log(JSON.stringify(action, null, 4))
            console.error("\n################################################")
            return cleanExit()
        }
    }
}


/**
 * @param {TrelloCreateListAction} createListAction
 * @param {CacheTargetBoard[]} targets
 */
async function processCreateListAction(createListAction, targets) {
    const sourceList = await trelloApiHelper.getList(createListAction.data.list.id)

    for (const targetBoard of targets) {
        const list = await trelloApiHelper.createList(
            targetBoard.id,
            // createListAction.data.board.id,
            await deepLApiHelper.translate(createListAction.data.list.name, globalThis.config.sourceBoard.language, targetBoard.language),
            sourceList.pos
        )
        cacheUtils.setList(createListAction.data.board.id, createListAction.data.list.id, targetBoard.id, list.id)
        cacheUtils.setTargetLastAction(createListAction.data.board.id, targetBoard.id, createListAction.id)
    }
}

/**
 * @param {TrelloUpdateListAction} updateListAction
 * @param {CacheTargetBoard[]} targets
 */
async function processUpdateListAction(updateListAction, targets) {
    for (const targetBoard of targets) {
        const targetListId = cacheUtils.getList(updateListAction.data.board.id, updateListAction.data.list.id, targetBoard.id)
        const changed = {}
        if (updateListAction.data.old.name !== undefined) { changed.name = await deepLApiHelper.translate(updateListAction.data.list.name, globalThis.config.sourceBoard.language, targetBoard.language) }
        if (updateListAction.data.old.closed !== undefined) { changed.closed = updateListAction.data.list.closed }
        if (updateListAction.data.old.pos !== undefined) { changed.pos = updateListAction.data.list.pos }

        if (Object.keys(changed).length === 0) {
            console.error(`
################################################
#
# unprocessed list update keys
#  please report to bot dev including the following object
#  you can skip/manage it by adding a case in index.js:processUpdateListAction()
#
################################################
`)
            console.log(JSON.stringify(updateListAction, null, 4))
            console.error(`
################################################`)
            return cleanExit()
        }

        await trelloApiHelper.updateList(targetListId, changed)
        cacheUtils.setTargetLastAction(updateListAction.data.board.id, targetBoard.id, updateListAction.id)
    }
}



/**
 * @param {TrelloCreateCardAction} createCardAction
 * @param {CacheTargetBoard[]} targets
 */
async function processCreateCardAction(createCardAction, targets) {
    const sourceCard = await trelloApiHelper.getCard(createCardAction.data.card.id)

    for (const targetBoard of targets) {
        const card = await trelloApiHelper.createCard(
            cacheUtils.getList(createCardAction.data.board.id, createCardAction.data.list.id, targetBoard.id),
            // createListAction.data.board.id,
            await deepLApiHelper.translate(createCardAction.data.card.name, globalThis.config.sourceBoard.language, targetBoard.language),
            sourceCard.pos
        )

        cacheUtils.setCard(createCardAction.data.board.id, createCardAction.data.card.id, targetBoard.id, card.id)
        cacheUtils.setTargetLastAction(createCardAction.data.board.id, targetBoard.id, createCardAction.id)
    }
}

/**
 * @param {TrelloUpdateCardAction} updateCardAction
 * @param {CacheTargetBoard[]} targets
 */
async function processUpdateCardAction(updateCardAction, targets) {
    /** @type {?Promise<TrelloCard>} */
    let sourceCard = null
    if (updateCardAction.data.old.idList !== undefined) {
        sourceCard = trelloApiHelper.getCard(updateCardAction.data.card.id)
    }

    for (const targetBoard of targets) {
        const targetCardId = cacheUtils.getCard(updateCardAction.data.board.id, updateCardAction.data.card.id, targetBoard.id)

        const changed = {}
        if (updateCardAction.data.old.name !== undefined) { changed.name = await deepLApiHelper.translate(updateCardAction.data.card.name, globalThis.config.sourceBoard.language, targetBoard.language) }
        if (updateCardAction.data.old.desc !== undefined) { changed.desc = await deepLApiHelper.translate(updateCardAction.data.card.desc, globalThis.config.sourceBoard.language, targetBoard.language) }
        if (updateCardAction.data.old.closed !== undefined) { changed.closed = updateCardAction.data.card.closed }
        if (updateCardAction.data.old.pos !== undefined) { changed.pos = updateCardAction.data.card.pos }
        if (updateCardAction.data.old.idList !== undefined) {
            changed.idList = cacheUtils.getList(updateCardAction.data.board.id, updateCardAction.data.listAfter.id, targetBoard.id)
            changed.pos = (await sourceCard)?.pos
        }
        if (updateCardAction.data.old.idLabels !== undefined) {
            changed.idLabels = updateCardAction.data.card.idLabels.map(sourceId => cacheUtils.getLabel(updateCardAction.data.board.id, sourceId, targetBoard.id))
        }
        if (updateCardAction.data.old.idAttachmentCover !== undefined) {
            changed.idAttachmentCover = updateCardAction.data.card.idAttachmentCover === "" ? null : updateCardAction.data.card.idAttachmentCover
        }

        if (Object.keys(changed).length === 0) {
            console.error(`
################################################
#
# unprocessed card update keys
#  please report to bot dev including the following object
#  you can skip/manage it by adding a case in index.js:processUpdateCardAction()
#
################################################
`)
            console.log(JSON.stringify(updateCardAction, null, 4))
            console.error(`
################################################`)
            return cleanExit()
        }

        await trelloApiHelper.updateCard(targetCardId, changed)
        cacheUtils.setTargetLastAction(updateCardAction.data.board.id, targetBoard.id, updateCardAction.id)
    }
}

/**
 * @param {TrelloAddChecklistToCardAction} addChecklistToCardAction
 * @param {CacheTargetBoard[]} targets
 */
async function processAddChecklistToCardAction(addChecklistToCardAction, targets){
    const sourceChecklist = await trelloApiHelper.getChecklist(addChecklistToCardAction.data.checklist.id)
    if (!sourceChecklist) {return}

    for (const targetBoard of targets) {
        const checklist = await trelloApiHelper.createChecklist(
            cacheUtils.getCard(addChecklistToCardAction.data.board.id, addChecklistToCardAction.data.card.id, targetBoard.id),
            await deepLApiHelper.translate(addChecklistToCardAction.data.checklist.name, globalThis.config.sourceBoard.language, targetBoard.language),
            sourceChecklist.pos
        )
        cacheUtils.setChecklist(addChecklistToCardAction.data.board.id, addChecklistToCardAction.data.checklist.id, targetBoard.id, checklist.id)

        for (const item of sourceChecklist.checkItems) {
            const checklistItem = await trelloApiHelper.createChecklistItem(
                checklist.id,
                {
                    name: await deepLApiHelper.translate(item.name, globalThis.config.sourceBoard.language, targetBoard.language),
                    pos: item.pos,
                    checked: false
                }
            )
            cacheUtils.setChecklistItem(addChecklistToCardAction.data.board.id, item.id, targetBoard.id, checklistItem.id)
        }

        cacheUtils.setTargetLastAction(addChecklistToCardAction.data.board.id, targetBoard.id, addChecklistToCardAction.id)
    }
}

/**
 * @param {TrelloUpdateCheckItemStateOnCardAction} updateCheckItemStateOnCardAction
 * @param {CacheTargetBoard[]} targets
 */
async function processUpdateCheckItemStateOnCardAction(updateCheckItemStateOnCardAction, targets) {
    /** TODO
     *   PUT https://api.trello.com/1/cards/659bf4594c6b6fe394bf3574/checkItem/undefined
     *   Error: 400 Bad Request invalid value for idCheckItem
     *     at file:///home/jselle/PhpstormProjects/trello-translate/api/fetchHelper.js:103:23
     *     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
     *     at async processUpdateCheckItemStateOnCardAction (file:///home/jselle/PhpstormProjects/trello-translate/index.js:358:9)
     *     at async file:///home/jselle/PhpstormProjects/trello-translate/index.js:88:13
     */
    for (const targetBoard of targets) {
        const cached = cacheUtils.getChecklistItem(updateCheckItemStateOnCardAction.data.board.id, updateCheckItemStateOnCardAction.data.checkItem.id, targetBoard.id)
        if (cached) {
            await trelloApiHelper.updateChecklistItem(
                cacheUtils.getCard(updateCheckItemStateOnCardAction.data.board.id, updateCheckItemStateOnCardAction.data.card.id, targetBoard.id),
                cached, {state: updateCheckItemStateOnCardAction.data.checkItem.state}
            )
        }
        cacheUtils.setTargetLastAction(updateCheckItemStateOnCardAction.data.board.id, targetBoard.id, updateCheckItemStateOnCardAction.id)
    }
}

/**
 * @param {TrelloCommentCardAction} commentCardAction
 * @param {CacheTargetBoard[]} targets
 */
async function processCommentCardAction(commentCardAction, targets) {
    for (const targetBoard of targets) {
        const commentAction = await trelloApiHelper.createComment(
            cacheUtils.getCard(commentCardAction.data.board.id, commentCardAction.data.card.id, targetBoard.id),
            await deepLApiHelper.translate(commentCardAction.data.text, globalThis.config.sourceBoard.language, targetBoard.language)
        )
        cacheUtils.setComment(commentCardAction.data.board.id, commentCardAction.id, targetBoard.id, commentAction.id)
        cacheUtils.setTargetLastAction(commentCardAction.data.board.id, targetBoard.id, commentCardAction.id)
    }
}

/**
 * @param {TrelloUpdateBoardAction} updateBoardAction
 * @param {CacheTargetBoard[]} targets
 */
async function processUpdateBoardAction(updateBoardAction, targets) {

    for (const targetBoard of targets) {
        const changed = {}
        if (updateBoardAction.data.old.name !== undefined) {
            const configBoard = globalThis.config.targetBoards.find(board => board.language === targetBoard.language)
            if (configBoard.name !== undefined) {
                changed.name = configBoard.name
            } else {
                const language = languages.find(lang => lang.language === targetBoard.language)
                changed.name = `${updateBoardAction.data.board.name} ${language.name}`
            }
        }
        if (updateBoardAction.data.old.desc !== undefined) { changed.desc = await deepLApiHelper.translate(updateBoardAction.data.board.desc ?? "", globalThis.config.sourceBoard.language, targetBoard.language) }
        if (updateBoardAction.data.old.closed !== undefined) { changed.closed = updateBoardAction.data.board.closed }
        if (updateBoardAction.data.old.prefs !== undefined) {
            const oldPrefs = updateBoardAction.data.old.prefs
            const newPrefs = updateBoardAction.data.board.prefs

            if (oldPrefs.background !== undefined) { changed["prefs/background"] = newPrefs.background }
            if (oldPrefs.selfJoin !== undefined) { changed["prefs/selfJoin"] = newPrefs.selfJoin }
        }

        /* visibility is kept as set in the config or manually set from the site */
        if (Object.keys(changed).length === 0 && updateBoardAction.data.old.prefs.permissionLevel !== undefined) {
            continue
        }

        if (Object.keys(changed).length === 0) {
            console.error(`
################################################
#
# unprocessed board update keys
#  please report to bot dev including the following object
#  you can skip/manage it by adding a case in index.js:processUpdateBoardAction()
#
################################################
`)
            console.log(JSON.stringify(updateBoardAction, null, 4))
            console.error(`
################################################`)
            return cleanExit()
        }

        await trelloApiHelper.updateBoard(targetBoard.id, changed)
        cacheUtils.setTargetLastAction(updateBoardAction.data.board.id, targetBoard.id, updateBoardAction.id)
    }
}

/**
 * @param {TrelloDeleteCardAction} deleteCardAction
 * @param {CacheTargetBoard[]} targets
 */
async function processDeleteCardAction(deleteCardAction, targets) {
/* TODO
    Error: 400 Bad Request invalid id
    at file:///home/jselle/PhpstormProjects/trello-translate/api/fetchHelper.js:103:23
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async processDeleteCardAction (file:///home/jselle/PhpstormProjects/trello-translate/index.js:430:9)
    at async file:///home/jselle/PhpstormProjects/trello-translate/index.js:88:13

 */
    for (const targetBoard of targets) {
        await trelloApiHelper.deleteCard(cacheUtils.deleteCard(deleteCardAction.data.board.id, deleteCardAction.data.card.id, targetBoard.id))
        cacheUtils.setTargetLastAction(deleteCardAction.data.board.id, targetBoard.id, deleteCardAction.id)
    }
}

/**
 * @param {TrelloAddAttachmentToCardAction} addAttachmentToCardAction
 * @param {CacheTargetBoard[]} targets
 */
async function processAddAttachmentToCardAction(addAttachmentToCardAction, targets) {
    const url = addAttachmentToCardAction.data.attachment.url ??
        (await trelloApiHelper.getCard(addAttachmentToCardAction.data.card.id)).cover.scaled?.find(({scaled}) => ! scaled).url

    if (! url) { return }

    for (const targetBoard of targets) {
        const attachment = await trelloApiHelper.createAttachment(
            cacheUtils.getCard(addAttachmentToCardAction.data.board.id, addAttachmentToCardAction.data.card.id, targetBoard.id),
            addAttachmentToCardAction.data.attachment.name, url
        )

        cacheUtils.setAttachment(addAttachmentToCardAction.data.board.id, addAttachmentToCardAction.data.attachment.id, targetBoard.id, attachment.id)
        cacheUtils.setTargetLastAction(addAttachmentToCardAction.data.board.id, targetBoard.id, addAttachmentToCardAction.id)
    }
}

/**
 * @param {TrelloUpdateChecklistAction} updateChecklistAction
 * @param {CacheTargetBoard[]} targets
 */
async function processUpdateChecklistAction(updateChecklistAction, targets) {

    for (const targetBoard of targets) {
        const changed = {}
        if (updateChecklistAction.data.old.name !== undefined) { changed.name = await deepLApiHelper.translate(updateChecklistAction.data.checklist.name ?? "", globalThis.config.sourceBoard.language, targetBoard.language) }
        // if (updateChecklistAction.data.old.pos !== undefined) { changed.pos = updateChecklistAction.data.checklist.pos }

        if (Object.keys(changed).length === 0) {
            console.error(`
################################################
#
# unprocessed checklist update keys
#  please report to bot dev including the following object
#  you can skip/manage it by adding a case in index.js:processUpdateChecklistAction()
#
################################################
`)
            console.log(JSON.stringify(updateChecklistAction, null, 4))
            console.error(`
################################################`)
            return cleanExit()
        }

        await trelloApiHelper.updateChecklist(
            cacheUtils.getChecklist(updateChecklistAction.data.board.id, updateChecklistAction.data.checklist.id, targetBoard.id),
            changed
        )

        cacheUtils.setTargetLastAction(updateChecklistAction.data.board.id, targetBoard.id, updateChecklistAction.id)
    }
}

/**
 * @param {TrelloDeleteAttachmentFromCardAction} deleteAttachmentFromCardAction
 * @param {CacheTargetBoard[]} targets
 */
async function processDeleteAttachmentFromCardAction(deleteAttachmentFromCardAction, targets) {
    for (const targetBoard of targets) {
        await trelloApiHelper.deleteAttachment(
            cacheUtils.getCard(deleteAttachmentFromCardAction.data.board.id, deleteAttachmentFromCardAction.data.card.id, targetBoard.id),
            cacheUtils.deleteAttachment(deleteAttachmentFromCardAction.data.board.id, deleteAttachmentFromCardAction.data.attachment.id, targetBoard.id)
        )

        cacheUtils.setTargetLastAction(deleteAttachmentFromCardAction.data.board.id, targetBoard.id, deleteAttachmentFromCardAction.id)
    }
}

/**
 * @param {TrelloConvertToCardFromCheckItemAction} convertToCardFromCheckItemAction
 * @param {CacheTargetBoard[]} targets
 */
async function processConvertToCardFromCheckItemAction(convertToCardFromCheckItemAction, targets) {
    for (const targetBoard of targets) {
        const card = await trelloApiHelper.createCard(
            cacheUtils.getList(convertToCardFromCheckItemAction.data.board.id, convertToCardFromCheckItemAction.data.list.id, targetBoard.id),
            await deepLApiHelper.translate(convertToCardFromCheckItemAction.data.card.name, globalThis.config.sourceBoard.language, targetBoard.language),
            "bottom"
        )

        cacheUtils.setCard(convertToCardFromCheckItemAction.data.board.id, convertToCardFromCheckItemAction.data.card.id, targetBoard.id, card.id)
        cacheUtils.setTargetLastAction(convertToCardFromCheckItemAction.data.board.id, targetBoard.id, convertToCardFromCheckItemAction.id)
    }
}

/**
 * @param {TrelloRemoveChecklistFromCardAction} removeChecklistFromCardAction
 * @param {CacheTargetBoard[]} targets
 */
async function processRemoveChecklistFromCardAction(removeChecklistFromCardAction, targets) {
    for (const targetBoard of targets) {
        await trelloApiHelper.deleteChecklist(
            cacheUtils.getChecklist(removeChecklistFromCardAction.data.board.id, removeChecklistFromCardAction.data.checklist.id, targetBoard.id)
        )

        cacheUtils.setTargetLastAction(removeChecklistFromCardAction.data.board.id, targetBoard.id, removeChecklistFromCardAction.id)
    }
}