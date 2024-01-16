import * as validationUtils from "../utils/validationUtils.js"

import "../config.js"
import * as deepLApiHelper from "../api/deepLApiHelper.js";

/**
 * @type {Object<languageMarker, {fullName: string, isSource?: boolean, isTarget?: boolean, isBoth?: boolean}>}
 */
const languages = {}

await validationUtils.validateDeepL()
const deeplKey = globalThis.deepL.APIKey

await deepLApiHelper.getSourceLanguages()
    .then(res =>
        res.forEach(({language, name}) => {
            if (!languages[language]) {
                languages[language] = {}
            }
            languages[language].fullName = name
            languages[language].isSource = true
        })
    )
    .catch(err => console.error(err))

await deepLApiHelper.getTargetLanguages()
    .then(res =>
        res.forEach(({language, name}) => {
            if (!languages[language]) {
                languages[language] = {}
            }
            languages[language].fullName = name
            languages[language].isTarget = true
            if (languages[language].isSource) {
                languages[language].isBoth = true
            }
        })
    )
    .catch(err => console.error(err))

console.log("Can be used as both source and target : ")
Object.entries(languages).filter(([marker, value]) => value.isBoth).forEach(([marker, value]) => console.log(`  - ${marker} : ${value.fullName}`))

console.log("\nCan be used as source only : ")
Object.entries(languages).filter(([marker, value]) => ! value.isBoth && value.isSource).forEach(([marker, value]) => console.log(`  - ${marker} : ${value.fullName}`))
console.log("\nCan be used as target only : ")
Object.entries(languages).filter(([marker, value]) => ! value.isBoth && value.isTarget).forEach(([marker, value]) => console.log(`  - ${marker} : ${value.fullName}`))

const deepLProPlan = ! globalThis.deepL.url.includes("free")
console.log(`\nUsing a ${deepLProPlan ? "pro" : "free"} account`)
console.log(`You have used ${globalThis.deepL.charCount}${deepLProPlan ? "" : ` / ${globalThis.deepL.charLimit}`} characters this month`)

