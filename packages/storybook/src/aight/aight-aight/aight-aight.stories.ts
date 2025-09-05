import type { Meta, StoryObj } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { aightAightTag } from '@ni/aight-components/dist/esm/aight-aight';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disabledDescription
} from '../../utilities/storybook';

interface AightAightArgs {
    text: string;
    disabled: boolean;
}

const metadata: Meta<AightAightArgs> = {
    title: 'Aight/Aight-Aight',
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <${aightAightTag}
            ?disabled="${x => x.disabled}"
        >${x => x.text}</${aightAightTag}>
    `),
    argTypes: {
        text: {
            description: 'The text to display in the Aight Aight.',
            table: { category: apiCategory.slots }
        },
        disabled: {
            description: disabledDescription({ componentName: 'aight aight' }),
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        text: 'Aight Aight Aight',
        disabled: false
    }
};

export default metadata;

export const aightAight: StoryObj<AightAightArgs> = {};
