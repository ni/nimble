import type { Meta, StoryObj } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { exButtonTag } from '@ni/ok-components/dist/esm/ex/button';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disabledDescription
} from '../../../utilities/storybook';

interface OkExButtonArgs {
    text: string;
    disabled: boolean;
}

const metadata: Meta<OkExButtonArgs> = {
    title: 'Ok/Ex Button',
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <${exButtonTag}
            ?disabled="${x => x.disabled}"
        >${x => x.text}</${exButtonTag}>
    `),
    argTypes: {
        text: {
            description: 'The text to display in the Ok Ex Button.',
            table: { category: apiCategory.slots }
        },
        disabled: {
            description: disabledDescription({ componentName: 'ok ex button' }),
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        text: 'Ok',
        disabled: false
    }
};

export default metadata;

export const exButton: StoryObj<OkExButtonArgs> = {};
