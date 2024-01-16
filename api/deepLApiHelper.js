import * as fetchHelper from "./fetchHelper.js";
import {arrayReviver} from "./fetchHelper.js";
import {SourceLanguage, TargetLanguage} from "../models/deepLModels.js";

/**
 * TODO
 *  HTTP 429: too many requests. Your application should be configured to resend the request after some delay, rather than constantly resending the request.
 *  HTTP 456: quota exceeded. The translation limit of your account has been reached. Consider upgrading your subscription.
 *  HTTP 500 and higher: temporary errors in the DeepL service. Your application should be configured to resend the request after some delay, rather than constantly resending the request.
 */

let totalChars = 0;

/**
 * get a list of all source languages usable with deepL
 * @return {Promise<SourceLanguage[]>}
 */
export function getSourceLanguages() {
    return fetchHelper.get(`${globalThis.deepL.url}/languages?${globalThis.deepL.urlParams}&type=source`, new arrayReviver(SourceLanguage))
}

/**
 * get a list of all target languages usable with deepL
 * @return {Promise<TargetLanguage[]>}
 */
export function getTargetLanguages() {
    return fetchHelper.get(`${globalThis.deepL.url}/languages?${globalThis.deepL.urlParams}&type=target`, new arrayReviver(TargetLanguage))
}

/**
 * @param {string} sentence
 * @param {languageMarker} sourceLanguage
 * @param {languageMarker} targetLanguage
 * @return {Promise<string>}
 */
export function translate(sentence, sourceLanguage, targetLanguage) {
    totalChars += sentence.length
    if (globalThis.config.verbose) {
        console.log(`Translating ${sentence.length} chars for a total of ${totalChars}`)
    }

    if (sourceLanguage === targetLanguage) {
        return new Promise(res => res(sentence))
    }
    if (sentence.length === 0) {
        return new Promise(res => res(sentence))
    }

    let urlParams = globalThis.deepL.urlParams
    urlParams += `&text=${sentence}`
    urlParams += `&source_lang=${sourceLanguage}`
    urlParams += `&target_lang=${targetLanguage}`
    urlParams += `&split_sentences=0`

    return fetchHelper.get(`${globalThis.deepL.url}/translate?${urlParams}`, {
        /**
         * @param {{translations: string[]}} value
         * @return {string}
         */
        fromJSON(value) {return value.translations[0].text}
    })
}