import type { Meta, StoryObj } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { rectangleTag } from '../../../../spright-components/src/rectangle';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disabledDescription
} from '../../utilities/storybook';

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
            description: 'The text to display in the rectangle.',
            table: { category: apiCategory.slots }
        },
        disabled: {
            description: disabledDescription({ componentName: 'rectangle' }),
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        text: 'Spright',
        disabled: false
    }
};

export default metadata;

export const rectangle: StoryObj<RectangleArgs> = {};
