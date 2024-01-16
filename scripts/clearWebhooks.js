import "../config.js"
import {validateConfig} from "../utils/validationUtils.js";
await validateConfig();

import {deleteWebHook, getWebhooksForToken} from "../api/trelloApiHelper.js";

if (process.argv.length < 3) {

    getWebhooksForToken(globalThis.trello.token)
        .then(webhooks => {
            console.log("available webhooks are:", webhooks)
        })

} else {
    deleteWebHook(process.argv[2])
}
