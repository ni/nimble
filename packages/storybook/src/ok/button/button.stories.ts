import type { Meta, StoryObj } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { buttonTag } from '@ni/ok-components/dist/esm/button';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disabledDescription
} from '../../utilities/storybook';

interface OkButtonArgs {
    text: string;
    disabled: boolean;
}

const metadata: Meta<OkButtonArgs> = {
    title: 'Ok/Button',
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <${buttonTag}
            ?disabled="${x => x.disabled}"
        >${x => x.text}</${buttonTag}>
    `),
    argTypes: {
        text: {
            description: 'The text to display in the Ok Button.',
            table: { category: apiCategory.slots }
        },
        disabled: {
            description: disabledDescription({ componentName: 'ok button' }),
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        text: 'Ok',
        disabled: false
    }
};

export default metadata;

export const button: StoryObj<OkButtonArgs> = {};
