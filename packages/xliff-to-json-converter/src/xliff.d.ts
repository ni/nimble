declare module 'xliff' {
    export type XliffTranslationString = string;

    export interface XliffTranslationObject {
        // Type comes from xliff library
        // eslint-disable-next-line @typescript-eslint/naming-convention, @stylistic/quote-props
        readonly 'Standalone': {
            // eslint-disable-next-line @stylistic/quote-props
            readonly 'id': string,
            readonly 'equiv-text': string
        };
    }

    export type XliffTranslationArray = readonly (XliffTranslationString | XliffTranslationObject)[];

    export interface XliffFile {
        readonly sourceLanguage: string;
        readonly targetLanguage: string;
        readonly resources: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            readonly 'ng2.template': {
                readonly [translationId: string]: {
                    readonly source: XliffTranslationString | XliffTranslationObject | XliffTranslationArray,
                    readonly target: XliffTranslationString | XliffTranslationObject | XliffTranslationArray
                }
            }
        };
    }

    function xliff12ToJs(contents: string, options: { captureSpacesBetweenElements: boolean }): Promise<XliffFile>;
}
