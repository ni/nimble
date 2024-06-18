import type { Meta } from '@storybook/html';
import { tokenNames } from '../../../../nimble-components/src/theme-provider/design-token-names';
import { createUserSelectedThemeStory } from '../../utilities/storybook';
import { component, metadata } from './tokens';
import '../../utilities/typed-object-keys';

const meta: Meta = {
    ...metadata,
    title: 'Tokens/Theme-aware Tokens'
};
export default meta;

const tokenNameKeys = Object.keys(tokenNames);
tokenNameKeys.sort((a, b) => a.localeCompare(b));

export const themeAwareTokens = createUserSelectedThemeStory(
    component(tokenNameKeys)
);
