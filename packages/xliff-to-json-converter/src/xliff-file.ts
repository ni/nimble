import { readFileSync } from 'fs';
import { xliff12ToJs, XliffFile } from 'xliff';

export async function loadXliff(path: string): Promise<XliffFile> {
    const xliff = readFileSync(path);
    return await parseXliff(xliff.toString());
}

export async function parseXliff(contents: string): Promise<XliffFile> {
    return await xliff12ToJs(contents, { captureSpacesBetweenElements: true });
}
