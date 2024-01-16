/**
 * @typedef {Object} sourceBoard
 * @property {TrelloId} id the board's id, you can get it with 'npm run getTrelloData'
 * @property {languageMarker} language the two (or four) letter code of the board's language, get the list of available languages with 'npm run getLanguages'
 */
/**
 * @typedef {Object} targetBoard information used to create a target board, the language should be unique between all target boards / there can only be one target per language
 * @property {languageMarker} language the two (or four) letter code of the board's language, get the list of available languages with 'npm run getLanguages'
 * @property {{id: TrelloId, isAdmin?: boolean}[]} [members] members to add to the board, isAdmin defaults to false, DON'T LIST THE MEMBER ASSOCIATED WITH THE TRELLO TOKEN
 * @property {string} [name] the name of the board, default to the source board name followed by the language english name
 * @property {string} [description] the description of the board, defaults to the translation of the source board description
 * @property {TrelloId} [workspace] the workspace of the board, defaults to the source board's workspace
 * @property {"org" | "private" | "public"} [visibility="public"] the board visibility
 */
/**
 * @typedef {Object} config
 * @property {string} serverURL the url of the server this program will be running on, needed to receive webhooks
 * @property {number} port the port of the webhook server
 * @property {string} [cachePath="./.cache"] path to cache file
 * @property {string} deepLAPIKey your deepL api key, both free and paid can be used
 * @property {string} trelloAuthToken your trelloAuthToken
 * @property {sourceBoard} sourceBoard information about the board to translate
 * @property {targetBoard[]} targetBoards information about the boards who'll contain the translated version
 * @property {boolean} [verbose=false] when true, output additional logs, can help debugging
 */

/**
 * @type {config}
 */
globalThis.config = {
  serverURL: "",
  port: 3000,
  cachePath: "",
  trelloAuthToken: "",
  deepLAPIKey: "",
  sourceBoard: {
    id: "",
    language: ""
  },
  targetBoards: []
}
