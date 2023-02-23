import { DesignToken } from '@microsoft/fast-foundation';
import { Direction } from '@microsoft/fast-web-utilities';
import { Theme } from './types';
import { prefersColorScheme } from '../utilities/prefers-color-scheme';

export const directionDefault = Direction.ltr;
export const direction = DesignToken.create<Direction>({
    name: 'direction',
    cssCustomPropertyName: null
}).withDefault(Direction.ltr);

export const themeDefault = (): Theme => (prefersColorScheme.dark ? Theme.dark : Theme.light);
export const theme = DesignToken.create<Theme>({
    name: 'theme',
    cssCustomPropertyName: null
}).withDefault(
    // @ts-expect-error See: https://github.com/microsoft/fast/issues/6529
    themeDefault
);
