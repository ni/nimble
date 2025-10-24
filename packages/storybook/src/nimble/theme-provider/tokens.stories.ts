import type { Meta, StoryObj } from '@storybook/html-vite';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { PropertyFormat } from '@ni/nimble-components/dist/esm/theme-provider/tests/types';
import { tokenNames as tokens } from '@ni/nimble-components/dist/esm/theme-provider/design-token-names';
import { createUserSelectedThemeStory } from '../../utilities/storybook';
import { component, type TokenArgs } from './template';

type TokenName = keyof typeof tokens;
const tokenNames = Object.keys(tokens) as TokenName[];
tokenNames.sort((a, b) => a.localeCompare(b));
const graphTokenNames = tokenNames.filter(x => x.startsWith('graph'));
const calendarTokenNames = tokenNames.filter(x => x.startsWith('calendar'));

const metadata: Meta<TokenArgs> = {
    title: 'Tokens/Theme-aware Tokens',
    parameters: {
        docs: {
            source: {
                code: null
            }
        },
        controls: { hideNoControlsWarning: true }
    },
    args: {
        propertyFormat: PropertyFormat.scss
    },
    argTypes: {
        propertyFormat: {
            options: Object.values(PropertyFormat),
            control: { type: 'radio' },
            name: 'Property Format'
        },
        tokenNames: {
            table: { disable: true }
        }
    },
    render: createUserSelectedThemeStory(component),
    // Setting token default values is done as part of the FAST render queue so it needs to be cleared before reading them
    // https://github.com/microsoft/fast/blob/bbf4e532cf9263727ef1bd8afbc30d79d1104c03/packages/web-components/fast-foundation/src/design-token/custom-property-manager.ts#LL154C3-L154C3
    // This uses Storybook's "loaders" feature to await the queue. https://storybook.js.org/docs/html/writing-stories/loaders
    loaders: [
        async (): Promise<void> => {
            await waitForUpdatesAsync();
        }
    ]
};

export default metadata;

export const themeAwareTokens: StoryObj<TokenArgs> = {
    args: { tokenNames }
};

export const graphTokens: StoryObj<TokenArgs> = {
    args: { tokenNames: graphTokenNames }
};

export const calendarTokens: StoryObj<TokenArgs> = {
    args: { tokenNames: calendarTokenNames }
};
