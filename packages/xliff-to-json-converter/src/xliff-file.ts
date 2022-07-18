import { readFileSync } from 'fs';
import { xliff12ToJs, XliffFile } from 'xliff';

export async function loadXliff(path: string): Promise<XliffFile> {
    const xliff = readFileSync(path);
    return parseXliff(xliff.toString());
}

export async function parseXliff(contents: string): Promise<XliffFile> {
    return xliff12ToJs(contents);
}
