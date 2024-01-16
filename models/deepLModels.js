/**
 * @typedef {string} languageMarker
 * ISO language code
 * find these by running "npm run getLanguages"
 * they either looks like XX or XX-XX (FR, EN-US, ...)
 */

/**
 * return of the get source language api
 */
export class SourceLanguage {
    /**
     * ISO code of the language
     * @type {languageMarker}
     */
    language
    /**
     * english full name of the language
     * @type {string}
     */
    name

    /**
     * @param {Object} value
     * @return {this}
     */
    fromJSON(value) {
        this.language = value.language
        this.name = value.name
        return this
    }

    /**
     * @return {Object}
     */
    toJSON() {
        return {
            language: this.language,
            name: this.name
        }
    }
}
/**
 * return of the get target language api
 */
export class TargetLanguage {
    /**
     * ISO code of the language
     * @type {languageMarker}
     */
    language
    /**
     * english full name of the language
     * @type {string}
     */
    name
    /**
     * if the language level can adapt to feel more natural
     * @type {boolean}
     */
    supports_formality

    /**
     * @param {Object} value
     * @return {TargetLanguage}
     */
    fromJSON(value) {
        this.language = value.language
        this.name = value.name
        this.supports_formality = value.supports_formality
        return this
    }

    /**
     * @return {Object}
     */
    toJSON() {
        return {
            language: this.language,
            name: this.name,
            supports_formality: this.supports_formality
        }
    }
}