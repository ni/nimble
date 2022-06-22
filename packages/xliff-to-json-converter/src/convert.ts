import { XliffFile, XliffTranslationArray, XliffTranslationObject, XliffTranslationString } from 'xliff';
import { JsonFile, saveJson, Translations } from './json-file';
import { Writeable } from './util';
import { loadXliff } from './xliff-file';

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

function xliffTranslation2jsonString(xliff: XliffTranslationArray | XliffTranslationObject | XliffTranslationString | undefined): string {
    if (xliff === undefined) {
        // translating the empty string (empty source is technically allowed, makes no sense)
        return '';
    }
    if (typeof xliff === 'string') {
        // translation is plain string without interpolation
        return xliff;
    }
    if (!(xliff instanceof Array)) {
        // translation just interpolation (makes no linguistical sense, but technically possible)
        return makeParsedTranslation(['', ''], [xliff.Standalone.id]);
    }
    // makeParsedTranslation expects messagePart0, placeholderName0,
    // messagePart1, placeholderName1, ..., messagePartN. May have to
    // add empty messagePart at front or back.
    const messageParts: string[] = [];
    const placeholderNames: string[] = [];
    for (const part of xliff) {
        if (typeof part === 'string') {
            messageParts.push(part);
        } else {
            // part is placeholder object
            if (messageParts.length === placeholderNames.length) {
                messageParts.push('');
            }
            placeholderNames.push(part.Standalone.id);
        }
    }
    if (messageParts.length === placeholderNames.length) {
        messageParts.push('');
    }
    return makeParsedTranslation(messageParts, placeholderNames);
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
