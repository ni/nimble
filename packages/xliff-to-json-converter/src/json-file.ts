import { writeFileSync } from 'fs';

export interface Translations {
    readonly [translationId: string]: string;
}

export interface JsonFile {
    readonly locale: string;
    readonly translations: Translations;
}

export function stringify(json: JsonFile): string {
    const content = JSON.stringify(json, undefined, 4);
    return content;
}

export function saveJson(json: JsonFile, dst: string): void {
    const content = stringify(json);
    writeFileSync(dst, content);
}
