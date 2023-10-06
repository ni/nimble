import { DesignToken } from '@microsoft/fast-foundation';
import { Direction } from '@microsoft/fast-web-utilities';
import { Theme } from './types';
import { prefersObserver } from '../utilities/models/prefers-observer';
import { isValidLang, documentElementObserver } from '../utilities/models/document-element-observer';

export const dirDefault = Direction.ltr;
export const dir = DesignToken.create<Direction>({
    name: 'dir',
    cssCustomPropertyName: null
}).withDefault(Direction.ltr);

export const themeDefault = (): Theme => (prefersObserver.colorSchemeDark ? Theme.dark : Theme.light);
export const theme = DesignToken.create<Theme>({
    name: 'theme',
    cssCustomPropertyName: null
}).withDefault(
    // @ts-expect-error See: https://github.com/microsoft/fast/issues/6529
    themeDefault
);

export const langDefault = (): string => (isValidLang(documentElementObserver.lang) ? documentElementObserver.lang : 'en-US');
export const lang = DesignToken.create<string>({
    name: 'lang',
    cssCustomPropertyName: null
}).withDefault(langDefault);
