import type { Meta, StoryObj } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { rectangleTag } from '@ni/spright-components/dist/esm/rectangle';
import { createUserSelectedThemeStory } from '../../utilities/storybook';

interface RectangleArgs {
    text: string;
    disabled: boolean;
}

const metadata: Meta<RectangleArgs> = {
    title: 'Spright/Rectangle',
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <${rectangleTag}
            ?disabled="${x => x.disabled}"
        >${x => x.text}</${rectangleTag}>
    `),
    argTypes: {
        text: {
            description: 'The text to display in the rectangle.'
        }
    },
    args: {
        text: 'Spright',
        disabled: false
    }
};

export default metadata;

export const rectangle: StoryObj<RectangleArgs> = {};
