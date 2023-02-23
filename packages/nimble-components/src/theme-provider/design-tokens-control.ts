import { DesignToken } from '@microsoft/fast-foundation';
import { Direction } from '@microsoft/fast-web-utilities';
import { Theme } from './types';
import { prefersColorScheme } from '../utilities/prefers-color-scheme';

// Not represented as a CSS Custom Property, instead available
// as an attribute of theme provider.
export const direction = DesignToken.create<Direction>({
    name: 'direction',
    cssCustomPropertyName: null
}).withDefault(Direction.ltr);

export const theme = DesignToken.create<Theme>({
    name: 'theme',
    cssCustomPropertyName: null
}).withDefault(
    // @ts-expect-error See: https://github.com/microsoft/fast/issues/6529
    () => (prefersColorScheme.dark ? Theme.dark : Theme.light)
);
