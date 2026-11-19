import { XliffFile, XliffTranslationArray, XliffTranslationObject, XliffTranslationString } from 'xliff';
import { JsonFile, saveJson, Translations } from './json-file.js';
import { Writeable } from './util.js';
import { loadXliff } from './xliff-file.js';

export async function convertXliff2Json(src: string, dst: string): Promise<void> {
    const xliff = await loadXliff(src);
    const json = xliff2Json(xliff);
    saveJson(json, dst);
}

export function xliff2Json(xliff: XliffFile): JsonFile {
    const translations: Writeable<Translations> = {};
    const template = xliff.resources['ng2.template'];
    Object.keys(template).forEach(key => {
        const target = template[key].target;
        const translation = xliffTranslation2jsonString(target);
        if (translation !== '') {
            translations[key] = translation;
        }
    });
    const json: JsonFile = {
        locale: xliff.targetLanguage,
        translations
    };
    return json;
}

// Inline elements that wrap other content; names come from the xliff library
/* eslint-disable @typescript-eslint/naming-convention */
type XliffPart = XliffTranslationString | XliffTranslationObject | {
    readonly Marker?: { readonly contents: XliffPart | readonly XliffPart[] },
    readonly GenericSpan?: { readonly contents: XliffPart | readonly XliffPart[] }
};
/* eslint-enable @typescript-eslint/naming-convention */

function xliffTranslation2jsonString(xliff: XliffTranslationArray | XliffTranslationObject | XliffTranslationString | undefined): string {
    if (xliff === undefined) {
        // translating the empty string (empty source is technically allowed, makes no sense)
        return '';
    }
    if (typeof xliff === 'string') {
        // translation is plain string without interpolation
        return xliff;
    }
    // makeParsedTranslation expects messagePart0, placeholderName0,
    // messagePart1, placeholderName1, ..., messagePartN. May have to
    // add empty messagePart at front or back.
    const messageParts: string[] = [];
    const placeholderNames: string[] = [];
    appendParts(xliff, messageParts, placeholderNames);
    if (messageParts.length === placeholderNames.length) {
        messageParts.push('');
    }
    return makeParsedTranslation(messageParts, placeholderNames);
}

function appendParts(parts: XliffPart | readonly XliffPart[], messageParts: string[], placeholderNames: string[]): void {
    if (parts instanceof Array) {
        parts.forEach(part => appendParts(part, messageParts, placeholderNames));
    } else if (typeof parts === 'string') {
        if (messageParts.length > placeholderNames.length) {
            // text split by CDATA, comments, or processing instructions
            messageParts[messageParts.length - 1] += parts;
        } else {
            messageParts.push(parts);
        }
    } else if ('Standalone' in parts) {
        // part is placeholder object
        if (messageParts.length === placeholderNames.length) {
            messageParts.push('');
        }
        placeholderNames.push(parts.Standalone.id);
    } else {
        // <mrk> and <g> only wrap content, so keep their contents
        const wrapper = parts.Marker ?? parts.GenericSpan;
        if (wrapper) {
            appendParts(wrapper.contents, messageParts, placeholderNames);
        }
    }
}

/**
 * Create a `ParsedTranslation` from a set of `messageParts` and `placeholderNames`.
 *
 * Adapted from the function in @angular/localize of the same name
 */
export function makeParsedTranslation(
    messageParts: readonly string[],
    placeholderNames: readonly string[],
): string {
    if (messageParts.length !== placeholderNames.length + 1) {
        throw new Error('translation part length mismatch');
    }
    let messageString = messageParts[0];
    for (let i = 0; i < placeholderNames.length; i++) {
        messageString += `{$${placeholderNames[i]}}${messageParts[i + 1]}`;
    }
    return messageString;
}
