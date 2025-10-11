import type { StoryFn, Meta } from '@storybook/html-vite';
import { PropertyFormat } from '@ni/nimble-components/dist/esm/theme-provider/tests/types';
import {
    tokenNames as tokens,
} from '@ni/nimble-components/dist/esm/theme-provider/design-token-names';
import { createFixedThemeStory } from '../../utilities/storybook';
import { sharedMatrixParameters } from '../../utilities/matrix';
import { backgroundStates } from '../../utilities/states';
import { component } from './tokens.stories';

type TokenName = keyof typeof tokens;
const tokenNames = Object.keys(tokens) as TokenName[];
tokenNames.sort((a, b) => a.localeCompare(b));

interface TokenArgs {
    metaTitle: string;
    tokenNames: TokenName[];
    propertyFormat: PropertyFormat;
}

const metadata: Meta<TokenArgs> = {
    title: 'Tests/Tokens',
    parameters: {
        ...sharedMatrixParameters()
    },
    args: {
        tokenNames,
        propertyFormat: PropertyFormat.scss
    },
};

export default metadata;

const [
    lightThemeWhiteBackground,
    colorThemeDarkGreenBackground,
    darkThemeBlackBackground,
    ...remaining
] = backgroundStates;

if (remaining.length > 0) {
    throw new Error('New backgrounds need to be supported');
}

export const lightTheme: StoryFn<TokenArgs> = createFixedThemeStory(
    component,
    lightThemeWhiteBackground
);

export const colorTheme: StoryFn<TokenArgs> = createFixedThemeStory(
    component,
    colorThemeDarkGreenBackground
);

export const darkTheme: StoryFn<TokenArgs> = createFixedThemeStory(
    component,
    darkThemeBlackBackground
);
