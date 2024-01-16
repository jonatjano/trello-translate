import {asTrelloId} from "../models/trelloModels.js";

/**
 * test if config looks like it can work
 * @return {Promise<void>}
 */
export function validateConfig() {
    if (typeof globalThis.config !== "object") {
        return new Promise((_, rej) => rej("Something unexpected happened, did you create the config.json file ?"))
    }

    if (
        ! asTrelloId(globalThis.config.sourceBoard.id)// ||
        // globalThis.config.targetBoards.some(board => ! asTrelloId(board.id))
    ) {
        return new Promise((_, rej) => rej("One board id is not valid"))
    }

    globalThis.config.port = process.env.PORT ?? globalThis.config.port ?? 3000
    if (globalThis.config.serverURL.endsWith("/")) {
        globalThis.config.serverURL = globalThis.config.serverURL.substring(0, globalThis.config.serverURL.length - 1)
    }
    globalThis.config.cachePath = globalThis.config.cachePath ?? "./.cache"

    return validateAPIKeys()
}

/**
 * check that both api tokens are valid
 * @return {Promise<void>}
 */
function validateAPIKeys() {
    return Promise.all([validateDeepL(), validateTrello()])
}

/**
 * check that the deepL auth token is valid
 * exit the process if not
 * @return {Promise<void>}
 */
export function validateDeepL() {
    // TODO DeepL API Free authentication keys can be identified easily by the suffix ":fx" (e.g., 279a2e9d-83b3-c416-7e2d-f721593e42a0:fx)
    const freeUrl = "https://api-free.deepl.com/v2"
    const proUrl = "https://api.deepl.com/v2"

    let fetchPromise

    if (globalThis.config.deepLAPIKey.endsWith(":fx")) {
        // free
        fetchPromise = fetch(`${freeUrl}/usage?auth_key=${globalThis.config.deepLAPIKey}`)
            .then(res => {
                if (res.status === 200) {
                    if (!globalThis.deepL) {globalThis.deepL = {}}
                    globalThis.deepL.url = freeUrl
                    return res
                } else if (res.status === 403) {
                    throw new Error("DeepL API key is invalid for free API")
                } else {
                    // throw res2
                    throw new Error("An unexpected error happened while validating deepL API key (p)")
                }
            })
    } else {
        // paid
        fetchPromise = fetch(`${proUrl}/usage?auth_key=${globalThis.config.deepLAPIKey}`)
            .then(res => {
                if (res.status === 200) {
                    if (!globalThis.deepL) {globalThis.deepL = {}}
                    globalThis.deepL.url = proUrl
                    return res
                } else if (res.status === 403) {
                    throw new Error("DeepL API key is invalid for pro API")
                } else {
                    // throw res2
                    throw new Error("An unexpected error happened while validating deepL API key (p)")
                }
            })
    }

    return fetchPromise
        .then(res => res.json())
        .then(res => {
            globalThis.deepL.APIKey = globalThis.config.deepLAPIKey
            globalThis.deepL.charCount = res.character_count
            globalThis.deepL.charLimit = res.character_limit
            globalThis.deepL.urlParams = `auth_key=${globalThis.config.deepLAPIKey}`
        })
        .catch(err => {
            console.error(err.message)
            process.exit(2)
        })
}

/**
 * check that the given trello auth token is valid
 * exit the process if not
 * @return {Promise<void>}
 */
export function validateTrello() {
    globalThis.trello = {
        url: "https://api.trello.com/1",
        key: "f852fbdb1ebee072098bbd17352d9763"
    }
    return fetch(`${globalThis.trello.url}/tokens/${globalThis.config.trelloAuthToken}?key=${globalThis.trello.key}&token=${globalThis.config.trelloAuthToken}`)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            } else if (res.status === 401) {
                throw new Error("Provided trello API token is not valid")
            } else {
                // throw res
                throw new Error("An unexpected error happened while validating trello token")
            }
        })
        .then(_ => {
            globalThis.trello.token = globalThis.config.trelloAuthToken
            globalThis.trello.urlParams = `key=${globalThis.trello.key}&token=${globalThis.trello.token}`
        })
        .catch(err => {
            console.error(err.message)
            process.exit(3)
        })
}
