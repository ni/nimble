import type { Meta, StoryObj } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { rectangleTag } from '..';

interface RectangleArgs {
    text: string;
    disabled: boolean;
}

const metadata: Meta<RectangleArgs> = {
    title: 'Components/Rectangle',
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
