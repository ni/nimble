import type { Meta } from '@storybook/html';
import { tokenNames } from '../../../../nimble-components/src/theme-provider/design-token-names';
import { createUserSelectedThemeStory } from '../../utilities/storybook';
import { component, metadata } from './tokens';
import '../../utilities/typed-object-keys';

const meta: Meta = {
    ...metadata,
    title: 'Tokens/Graph Styling'
};
export default meta;

const graphTokenNames = Object.keys(tokenNames).filter(x => x.startsWith('graph'));

export const graphStyling = createUserSelectedThemeStory(
    component(graphTokenNames)
);
